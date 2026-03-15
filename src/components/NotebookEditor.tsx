import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/db';
import { PASTEL_COLORS } from '@/lib/constants';
import { ImageUploader } from './ImageUploader';
import { ArrowLeft, Highlighter, StickyNote, Image as ImageIcon, Sparkles, Video, Search, MapPin, X, Plus, Trash2, Palette, Check, Type, Minus, AlignLeft, User, Camera, Album, ChevronDown, ChevronUp, Archive, Heart, GitBranch, MousePointer2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { AIModal } from './AIModal';
import { PhotoAlbum, PhotoCard } from './PhotoAlbum';
import { MIND_MAP_TEMPLATES } from '@/lib/mindMapTemplates';

interface NotebookEditorProps {
  notebookId: string;
  onBack: () => void;
  onOpenMemoryKeeper: () => void;
}

interface StickyNoteData {
  id: string;
  text: string;
  position: { x: number; y: number };
  attachedToText?: string;
}

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId?: string;
  width?: number;
  height?: number;
}

interface Attachment {
  id: string;
  type: 'image' | 'video';
  url: string; // Base64 or Blob URL
  analysis?: string;
}

// Helper to load font dynamically
const loadFont = (font: string) => {
  if (!font) return;
  const linkId = `font-${font.replace(/\s+/g, '-')}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

interface FontPreviewProps {
  font: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const FontPreview: React.FC<FontPreviewProps> = ({ font, index, isSelected, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lazy load font for preview
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadFont(font);
          setIsLoaded(true);
          observer.disconnect();
        }
      });
    });
    
    const element = document.getElementById(`font-preview-${font}`);
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, [font]);

  return (
    <button
      id={`font-preview-${font}`}
      onClick={onClick}
      className={`p-4 rounded-xl text-left transition-all hover:scale-105 hover:shadow-md group relative overflow-hidden ${isSelected ? 'ring-2 ring-stone-800 ring-offset-2' : ''}`}
      style={{ 
          backgroundColor: [
              '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
              '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
          ][index % 9],
          fontFamily: isLoaded ? font : 'inherit'
      }}
    >
      <span className="text-lg text-stone-800 group-hover:text-black relative z-10">Abc</span>
      <span className="block text-xs text-stone-500 mt-1 truncate relative z-10">{font}</span>
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <Check className="w-4 h-4 text-stone-800" />
        </div>
      )}
    </button>
  );
};

// Highlight colors provided by user
const HIGHLIGHT_COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

// Updated Text Colors as requested
const TEXT_COLORS = [
  '#292524', // Keeping one dark color for usability
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5'
];

const AVAILABLE_FONTS = [
  'Abel', 'Abril Fatface', 'Aclonica', 'Acme', 'Actor', 'Adamina', 'Advent Pro', 'Aguafina Script', 'Akronim', 'Aladin', 
  'Aldrich', 'Alef', 'Alegreya', 'Alegreya Sans', 'Alegreya SC', 'Aleo', 'Alex Brush', 'Alfa Slab One', 'Alice', 'Alike', 
  'Allerta', 'Allura', 'Almendra', 'Almendra Display', 'Amaranth', 'Amatic SC', 'Amethysta', 'Amiko', 'Amiri', 'Amita',
  'Anaheim', 'Andada', 'Andika', 'Angkor', 'Annie Use Your Telescope', 'Anonymous Pro', 'Antic', 'Antic Didone', 'Antic Slab', 'Anton', 
  'Arapey', 'Arbutus', 'Arbutus Slab', 'Architects Daughter', 'Archivo', 'Archivo Black', 'Archivo Narrow', 'Are You Serious', 'Arima Madurai', 'Arimo', 
  'Arizonia', 'Armata', 'Arsenal', 'Artifika', 'Arvo', 'Arya', 'Asap', 'Asar', 'Asset', 'Assistant', 'Astloch', 
  'Asul', 'Athiti', 'Atma', 'Atomic Age', 'Aubrey', 'Audiowide', 'Autour One', 'Average', 'Average Sans', 'Averia Gruesa Libre', 
  'Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre', 'Bad Script', 'Bahiana', 'Baloo', 'Baloo Bhai', 'Baloo Bhaina', 'Baloo Chettan', 'Baloo Da', 
  'Baloo Paaji', 'Baloo Tamma', 'Baloo Thambi', 'Balthazar', 'Bangers', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Basic', 'Battambang', 
  'Baumans', 'Bayon', 'Belgrano', 'Bellefair', 'Belleza', 'BenchNine', 'Bentham', 'Berkshire Swash', 'Bevan', 'Bigelow Rules', 
  'Bigshot One', 'Bilbo', 'Bilbo Swash Caps', 'Bitter', 'Black And White Picture', 'Black Han Sans', 'Black Ops One', 'Bokor', 'Bonbon', 'Boogaloo', 
  'Bowlby One', 'Bowlby One SC', 'Brawler', 'Bree Serif', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard', 'Bungee', 'Bungee Hairline', 
  'Bungee Inline', 'Bungee Outline', 'Bungee Shade', 'Butcherman', 'Butterfly Kids', 'Cabin', 'Cabin Condensed', 'Cabin Sketch', 'Caesar Dressing', 'Cagliostro', 
  'Cairo', 'Calligraffitti', 'Cambay', 'Cambo', 'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Capriola', 'Cardo', 
  'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Catamaran', 'Caudex', 'Caveat', 'Caveat Brush', 'Cedarville Cursive', 'Ceviche One', 
  'Chakra Petch', 'Changa', 'Changa One', 'Chango', 'Chathura', 'Chau Philomene One', 'Chela One', 'Chelsea Market', 'Chenla', 'Cherry Cream Soda', 
  'Cherry Swash', 'Chewy', 'Chicle', 'Chivo', 'Chonburi', 'Cinzel', 'Cinzel Decorative', 'Clicker Script', 'Coda', 'Coda Caption', 
  'Codystar', 'Coiny', 'Combo', 'Comfortaa', 'Coming Soon', 'Concert One', 'Condiment', 'Content', 'Contrail One', 'Convergence', 
  'Cookie', 'Copse', 'Corben', 'Courgette', 'Courier Prime', 'Cousine', 'Coustard', 'Covered By Your Grace', 'Crafty Girls', 'Creepster', 
  'Crete Round', 'Crimson Text', 'Croissant One', 'Crushed', 'Cuprum', 'Cutive', 'Cutive Mono', 'Damion', 'Dancing Script', 'Dangrek', 
  'Darker Grotesque', 'David Libre', 'Dawning of a New Day', 'Days One', 'Dekko', 'Delius', 'Delius Swash Caps', 'Delius Unicase', 'Della Respira', 'Denk One', 
  'Devonshire', 'Dhurjati', 'Didact Gothic', 'Diplomata', 'Diplomata SC', 'DM Sans', 'DM Serif Display', 'DM Serif Text', 'Do Hyeon', 'Dokdo', 
  'Domine', 'Donegal One', 'Doppio One', 'Dorsa', 'Dosis', 'Dr Sugiyama', 'Duru Sans', 'Dynalight', 'EB Garamond', 'Eagle Lake', 
  'Eater', 'Economica', 'Eczar', 'El Messiri', 'Electrolize', 'Elsie', 'Elsie Swash Caps', 'Emblema One', 'Emilys Candy', 'Encode Sans', 
  'Encode Sans Condensed', 'Encode Sans Expanded', 'Encode Sans Semi Condensed', 'Encode Sans Semi Expanded', 'Engagement', 'Englebert', 'Enriqueta', 'Erica One', 'Esteban', 'Euphoria Script', 
  'Ewert', 'Exo', 'Exo 2', 'Expletus Sans', 'Fahkwang', 'Fanwood Text', 'Farro', 'Farsan', 'Fascinate', 'Fascinate Inline', 
  'Faster One', 'Fasthand', 'Fauna One', 'Faustina', 'Federant', 'Federo', 'Felipa', 'Fenix', 'Finger Paint', 'Fira Code', 
  'Fira Mono', 'Fira Sans', 'Fira Sans Condensed', 'Fira Sans Extra Condensed', 'Fjalla One', 'Fjord One', 'Flamenco', 'Flavors', 'Fondamento', 'Fontdiner Swanky', 
  'Forum', 'Francois One', 'Frank Ruhl Libre', 'Freckle Face', 'Fredericka the Great', 'Fredoka One', 'Freehand', 'Fresca', 'Frijole', 'Fruktur', 
  'Fugaz One', 'GFS Didot', 'GFS Neohellenic', 'Gabriela', 'Gaegu', 'Gafata', 'Galada', 'Galdeano', 'Galindo', 'Gamja Flower', 
  'Gayathri', 'Gelasio', 'Gentium Basic', 'Gentium Book Basic', 'Geo', 'Geostar', 'Geostar Fill', 'Germania One', 'Gidugu', 'Gilda Display', 
  'Give You Glory', 'Glass Antiqua', 'Glegoo', 'Gloria Hallelujah', 'Goblin One', 'Gochi Hand', 'Gorditas', 'Gothic A1', 'Goudy Bookletter 1911', 'Graduate', 
  'Grand Hotel', 'Gravitas One', 'Great Vibes', 'Griffy', 'Gruppo', 'Gudea', 'Gugi', 'Gurajada', 'Habibi', 'Halant', 
  'Hammersmith One', 'Hanalei', 'Hanalei Fill', 'Handlee', 'Hanuman', 'Happy Monkey', 'Harmattan', 'Headland One', 'Heebo', 'Henny Penny', 
  'Hepta Slab', 'Herr Von Muellerhoff', 'Hi Melody', 'Hind', 'Hind Guntur', 'Hind Madurai', 'Hind Siliguri', 'Hind Vadodara', 'Holtwood One SC', 'Homemade Apple', 
  'Homenaje', 'IBM Plex Mono', 'IBM Plex Sans', 'IBM Plex Sans Condensed', 'IBM Plex Serif', 'IM Fell DW Pica', 'IM Fell DW Pica SC', 'IM Fell Double Pica', 'IM Fell Double Pica SC', 'IM Fell English', 
  'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC', 'IM Fell Great Primer', 'IM Fell Great Primer SC', 'Ibarra Real Nova', 'Iceberg', 'Iceland', 'Imprima', 'Inconsolata', 
  'Inder', 'Indie Flower', 'Inika', 'Inknut Antiqua', 'Inria Serif', 'Inter', 'Irish Grover', 'Istok Web', 'Italiana', 'Italianno', 
  'Itim', 'Jacques Francois', 'Jacques Francois Shadow', 'Jaldi', 'Jim Nightshade', 'Jockey One', 'Jolly Lodger', 'Jomhuria', 'Josefin Sans', 'Josefin Slab', 
  'Joti One', 'Jua', 'Judson', 'Julee', 'Julius Sans One', 'Junge', 'Jura', 'Just Another Hand', 'Just Me Again Down Here', 'K2D', 
  'Kadwa', 'Kalam', 'Kameron', 'Kanit', 'Kantumruy', 'Karla', 'Karma', 'Katibeh', 'Kaushan Script', 'Kavivanar', 
  'Kavoon', 'Kdam Thmor', 'Keania One', 'Kelly Slab', 'Kenia', 'Khand', 'Khmer', 'Khula', 'Kirang Haerang', 'Kite One', 
  'Knewave', 'KoHo', 'Kodchasan', 'Kosugi', 'Kosugi Maru', 'Kotta One', 'Koulen', 'Kranky', 'Kreon', 'Kristi', 
  'Krona One', 'Krub', 'Kulkino', 'Kurale', 'La Belle Aurore', 'Lacquer', 'Laila', 'Lakki Reddy', 'Lalezar', 'Lancelot', 
  'Lateef', 'Lato', 'League Script', 'Leckerli One', 'Ledger', 'Lekton', 'Lemon', 'Lemonada', 'Lexend Deca', 'Lexend Exa', 
  'Lexend Giga', 'Lexend Mega', 'Lexend Peta', 'Lexend Tera', 'Lexend Zetta', 'Libre Barcode 128', 'Libre Barcode 128 Text', 'Libre Barcode 39', 'Libre Barcode 39 Extended', 'Libre Barcode 39 Extended Text', 
  'Libre Barcode 39 Text', 'Libre Baskerville', 'Libre Caslon Display', 'Libre Caslon Text', 'Libre Franklin', 'Life Savers', 'Lilita One', 'Lily Script One', 'Limelight', 'Linden Hill', 
  'Literata', 'Liu Jian Mao Cao', 'Livvic', 'Lobster', 'Lobster Two', 'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch', 'Londrina Solid', 'Long Cang', 
  'Lora', 'Love Ya Like A Sister', 'Loved by the King', 'Lovers Quarrel', 'Luckiest Guy', 'Lusitana', 'Lustria', 'M PLUS 1p', 'M PLUS Rounded 1c', 'Ma Shan Zheng', 
  'Macondo', 'Macondo Swash Caps', 'Mada', 'Miden', 'Magra', 'Maiden Orange', 'Maitree', 'Major Mono Display', 'Mako', 'Mali', 
  'Mallanna', 'Mandali', 'Manjari', 'Manrope', 'Mansalva', 'Manuale', 'Marcellus', 'Marcellus SC', 'Marck Script', 'Margarine', 
  'Markazi Text', 'Marko One', 'Marmelad', 'Martel', 'Martel Sans', 'Marvel', 'Mate', 'Mate SC', 'Maven Pro', 'McLaren', 
  'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai', 'Megrim', 'Meie Script', 'Merienda', 'Merienda One', 'Merriweather', 'Merriweather Sans', 
  'Metal', 'Metal Mania', 'Metamorphous', 'Metrophobic', 'Michroma', 'Milonga', 'Miltonian', 'Miltonian Tattoo', 'Mina', 'Miniver', 
  'Miriam Libre', 'Mirza', 'Miss Fajardose', 'Mitr', 'Modak', 'Modern Antiqua', 'Mogra', 'Molengo', 'Molle', 'Monda', 
  'Monofett', 'Monoton', 'Monsieur La Doulaise', 'Montaga', 'Montez', 'Montserrat', 'Montserrat Alternates', 'Montserrat Subrayada', 'Moul', 'Moulpali', 
  'Mountains of Christmas', 'Mouse Memoirs', 'Mr Bedfort', 'Mr Dafoe', 'Mr De Haviland', 'Mr Poop', 'Mrs Saint Delafield', 'Mrs Sheppards', 'Mukta', 'Mukta Mahee', 
  'Mukta Malar', 'Mukta Vaani', 'Muli', 'Mystery Quest', 'NTR', 'Nanum Brush Script', 'Nanum Gothic', 'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script', 
  'Neucha', 'Neuton', 'New Rocker', 'News Cycle', 'Niconne', 'Niramit', 'Nixie One', 'Nobile', 'Nokora', 'Norican', 
  'Nosifer', 'Notable', 'Nothing You Could Do', 'Noticia Text', 'Noto Sans', 'Noto Sans HK', 'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 
  'Noto Serif', 'Noto Serif JP', 'Noto Serif KR', 'Noto Serif SC', 'Noto Serif TC', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round', 
  'Nova Script', 'Nova Slim', 'Nova Square', 'Numans', 'Nunito', 'Nunito Sans', 'Odor Mean Chey', 'Offside', 'Old Standard TT', 'Oldenburg', 
  'Oleo Script', 'Oleo Script Swash Caps', 'Open Sans', 'Open Sans Condensed', 'Oranienbaum', 'Orbitron', 'Oregano', 'Orienta', 'Original Surfer', 'Oswald', 
  'Over the Rainbow', 'Overlock', 'Overlock SC', 'Overpass', 'Overpass Mono', 'Ovo', 'Oxanium', 'Oxygen', 'Oxygen Mono', 'PT Mono', 
  'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Pacifico', 'Padauk', 'Palanquin', 'Palanquin Dark', 'Pangolin', 
  'Paprika', 'Parisienne', 'Passero One', 'Passion One', 'Pathway Gothic One', 'Patrick Hand', 'Patrick Hand SC', 'Pattaya', 'Patua One', 'Pavanam', 
  'Paytone One', 'Peddana', 'Peralta', 'Permanent Marker', 'Petit Formal Script', 'Petrona', 'Philosopher', 'Piedra', 'Pinyon Script', 'Pirata One', 
  'Plaster', 'Play', 'Playball', 'Playfair Display', 'Playfair Display SC', 'Podkova', 'Poiret One', 'Poller One', 'Poly', 'Pompiere', 
  'Pontano Sans', 'Poor Story', 'Poppins', 'Port Lligat Sans', 'Port Lligat Slab', 'Pragati Narrow', 'Prata', 'Preahvihear', 'Press Start 2P', 'Pridi', 
  'Princess Sofia', 'Prociono', 'Prompt', 'Prosto One', 'Proza Libre', 'Public Sans', 'Puritan', 'Purple Purse', 'Quando', 'Quantico', 
  'Quattrocento', 'Quattrocento Sans', 'Questrial', 'Quicksand', 'Quintessential', 'Qwigley', 'Racing Sans One', 'Radley', 'Rajdhani', 'Rakkas', 
  'Raleway', 'Raleway Dots', 'Ramabhadra', 'Ramaraja', 'Rambla', 'Rammetto One', 'Ranchers', 'Rancho', 'Ranga', 'Rasa', 
  'Rationale', 'Ravi Prakash', 'Red Hat Display', 'Red Hat Text', 'Reem Kufi', 'Reenie Beanie', 'Revalia', 'Rhodium Libre', 'Ribeye', 'Ribeye Marrow', 
  'Righteous', 'Risque', 'Roboto', 'Roboto Condensed', 'Roboto Mono', 'Roboto Slab', 'Rochester', 'Rock Salt', 'Rokkitt', 'Romanesco', 
  'Ropa Sans', 'Rosario', 'Rosarivo', 'Rouge Script', 'Rozha One', 'Rubik', 'Rubik Mono One', 'Ruda', 'Rufina', 'Ruge Boogie', 
  'Ruluko', 'Rum Raisin', 'Ruslan Display', 'Russo One', 'Ruthie', 'Rye', 'Sacramento', 'Sahitya', 'Sail', 'Saira', 
  'Saira Condensed', 'Saira Extra Condensed', 'Saira Semi Condensed', 'Saira Stencil One', 'Salsa', 'Sanchez', 'Sancreek', 'Sansita', 'Sarala', 'Sarina', 
  'Sarpanch', 'Satisfy', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade', 'Schoolbell', 'Scope One', 'Seaweed Script', 'Secular One', 
  'Sedgwick Ave', 'Sedgwick Ave Display', 'Sevillana', 'Seymour One', 'Shadows Into Light', 'Shadows Into Light Two', 'Shanti', 'Share', 'Share Tech', 'Share Tech Mono', 
  'Shojumaru', 'Short Stack', 'Shrikhand', 'Siemreap', 'Sigmar One', 'Signika', 'Signika Negative', 'Simonetta', 'Single Day', 'Sintony', 
  'Sirin Stencil', 'Six Caps', 'Skranji', 'Slabo 13px', 'Slabo 27px', 'Slackey', 'Smokum', 'Smythe', 'Sniglet', 'Snippet', 
  'Snowburst One', 'Sofadi One', 'Sofia', 'Solway', 'Song Myung', 'sonsie One', 'Sorts Mill Goudy', 'Source Code Pro', 'Source Sans Pro', 'Source Serif Pro', 
  'Space Mono', 'Special Elite', 'Spectral', 'Spectral SC', 'Spicy Rice', 'Spinnaker', 'Spirax', 'Squada One', 'Sree Krushnadevaraya', 'Sriracha', 
  'Srisakdi', 'Staatliches', 'Stalemate', 'Stalinist One', 'Stardos Stencil', 'Stint Ultra Condensed', 'Stint Ultra Expanded', 'Stoke', 'Strait', 'Stylish', 
  'Sue Ellen Francisco', 'Suez One', 'Sulphur Point', 'Sumana', 'Sunflower', 'Sunshiney', 'Supermercado One', 'Sura', 'Suranna', 'Suravaram', 
  'Suwannaphum', 'Swanky and Moo Moo', 'Syncopate', 'Tajawal', 'Tangerine', 'Taprom', 'Tauri', 'Taviraj', 'Teko', 'Telex', 
  'Tenali Ramakrishna', 'Tenor Sans', 'Text Me One', 'Thasadith', 'The Girl Next Door', 'Tienne', 'Tillana', 'Timmana', 'Tinos', 'Titan One', 
  'Titillium Web', 'Tomorrow', 'Trade Winds', 'Trirong', 'Trocchi', 'Trochut', 'Trykker', 'Tulpen One', 'Turret Road', 'Ubuntu', 
  'Ubuntu Condensed', 'Ubuntu Mono', 'Ultra', 'Uncial Antiqua', 'Underdog', 'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock', 
  'Unna', 'VT323', 'Vampiro One', 'Varela', 'Varela Round', 'Vast Shadow', 'Vesper Libre', 'Vibur', 'Vidaloka', 'Viga', 
  'Voces', 'Volkhov', 'Vollkorn', 'Vollkorn SC', 'Voltaire', 'Waiting for the Sunrise', 'Wallpoet', 'Walter Turncoat', 'Warnes', 'Wellfleet', 
  'Wendy One', 'Wire One', 'Work Sans', 'Yanone Kaffeesatz', 'Yantramanav', 'Yatra One', 'Yellowtail', 'Yeon Sung', 'Yeseva One', 'Yesteryear', 
  'Yrsa', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'ZCOOL XiaoWei', 'Zilla Slab', 'Zilla Slab Highlight'
].sort();

export function NotebookEditor({ notebookId, onBack, onOpenMemoryKeeper }: NotebookEditorProps) {
  const [notebook, setNotebook] = useState<any>(null);
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Header Images
  const [headerCover, setHeaderCover] = useState('');
  const [headerAvatar, setHeaderAvatar] = useState('');
  
  // Photo Album State
  const [photoCards, setPhotoCards] = useState<PhotoCard[]>([]);
  const [albumCover, setAlbumCover] = useState('');
  const [albumAvatar, setAlbumAvatar] = useState('');
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Tool States
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTextStylePicker, setShowTextStylePicker] = useState(false);
  
  // Style States
  const [activeHighlightColor, setActiveHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [activeTextColor, setActiveTextColor] = useState(TEXT_COLORS[0]);
  const [paperPattern, setPaperPattern] = useState<'none' | 'dots' | 'lines' | 'grid'>('none');
  
  // New UI States
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [showFontHeartPicker, setShowFontHeartPicker] = useState(false);
  
  // AI Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(null);

  // Mind Map State
  const [showMindMap, setShowMindMap] = useState(false);
  const [showFloatingFontTool, setShowFloatingFontTool] = useState(false);
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([]);
  const [activeMindMapNodeId, setActiveMindMapNodeId] = useState<string | null>(null);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Mind Map Enhanced State
  const [mindMapTransform, setMindMapTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [connectionStyle, setConnectionStyle] = useState<'curve' | 'straight' | 'step'>('curve');
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [tempConnection, setTempConnection] = useState<{ startId: string, endX: number, endY: number } | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    loadNotebook();
  }, [notebookId]);

  // Load the active font
  useEffect(() => {
    loadFont(fontFamily);
  }, [fontFamily]);

  // Sync content state to editable div when content changes externally
  useEffect(() => {
    if (contentRef.current && content !== contentRef.current.innerHTML) {
      const isFocused = document.activeElement === contentRef.current;
      if (!isFocused || Math.abs(content.length - contentRef.current.innerHTML.length) > 5) {
         contentRef.current.innerHTML = content;
      }
    }
  }, [content]);

  // Global Mouse Up Handler to prevent "stuck" dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingNode) setIsDraggingNode(false);
      if (isPanning) setIsPanning(false);
      if (tempConnection) {
         setTempConnection(null);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isPanning) {
            setMindMapTransform(prev => ({
                ...prev,
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            }));
        }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDraggingNode, isPanning, tempConnection, panStart]);

  const loadNotebook = async () => {
    const nb = await db.getNotebook(notebookId);
    if (nb) {
      setNotebook(nb);
      setBgColor(nb.bgColor || PASTEL_COLORS[0]);
      if (nb.content) {
        setContent(nb.content);
        if (contentRef.current) {
            contentRef.current.innerHTML = nb.content;
        }
      }
      if (nb.bgImage) setBgImage(nb.bgImage);
      if (nb.stickyNotes) setStickyNotes(nb.stickyNotes);
      if (nb.attachments) setAttachments(nb.attachments);
      if (nb.fontSize) setFontSize(nb.fontSize);
      
      if (nb.fontFamily) {
        if (nb.fontFamily === 'font-serif') setFontFamily('Playfair Display');
        else if (nb.fontFamily === 'font-sans') setFontFamily('Inter');
        else if (nb.fontFamily === 'font-mono') setFontFamily('JetBrains Mono');
        else setFontFamily(nb.fontFamily);
      }
      
      if (nb.headerCover) setHeaderCover(nb.headerCover);
      if (nb.headerAvatar) setHeaderAvatar(nb.headerAvatar);
      if (nb.paperPattern) setPaperPattern(nb.paperPattern);
      if (nb.photoCards) setPhotoCards(nb.photoCards);
      if (nb.albumCover) setAlbumCover(nb.albumCover);
      if (nb.albumAvatar) setAlbumAvatar(nb.albumAvatar);
      if (nb.mindMapNodes) setMindMapNodes(nb.mindMapNodes);
    }
  };

  const saveWork = async () => {
    if (!notebook) return;
    const updated = {
      ...notebook,
      content,
      bgColor,
      bgImage,
      stickyNotes,
      attachments,
      fontSize,
      fontFamily,
      headerCover,
      headerAvatar,
      paperPattern,
      photoCards,
      albumCover,
      albumAvatar,
      mindMapNodes,
      lastModified: new Date().toISOString()
    };
    await db.saveNotebook(updated);
    setNotebook(updated);
  };

  useEffect(() => {
    const timer = setTimeout(saveWork, 1000);
    return () => clearTimeout(timer);
  }, [content, bgColor, bgImage, stickyNotes, attachments, fontSize, fontFamily, headerCover, headerAvatar, paperPattern, photoCards, albumCover, albumAvatar, mindMapNodes]);

  const handleAddToMemoryKeeper = async () => {
    if (!notebook) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    const entry = {
      id: uuidv4(),
      notebookId: notebookId,
      content: textContent,
      htmlContent: content,
      createdAt: new Date().toISOString(),
      tags: [],
      attachments: attachments
    };

    await db.saveEntry(entry);
    onOpenMemoryKeeper();
  };

  const handleAddStickyNote = () => {
    const newNote: StickyNoteData = {
      id: uuidv4(),
      text: '',
      position: { x: 20, y: 100 }
    };
    setStickyNotes([...stickyNotes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateStickyNote = (id: string, text: string) => {
    setStickyNotes(notes => notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(notes => notes.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const handleAddAttachment = (url: string, type: 'image' | 'video' = 'image') => {
    setAttachments([...attachments, { id: uuidv4(), type, url }]);
  };

  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!contentRef.current?.contains(range.commonAncestorContainer)) return;

    const span = document.createElement('span');
    span.style.backgroundColor = activeHighlightColor;
    span.style.padding = '2px 0';
    span.style.borderRadius = '2px';
    
    try {
      range.surroundContents(span);
      if (contentRef.current) setContent(contentRef.current.innerHTML);
      selection.removeAllRanges();
    } catch (e) {
      console.warn("Cannot highlight across block elements");
      alert("Please select text within a single paragraph to highlight.");
    }
  };

  const handleTextColorChange = (color: string) => {
    setActiveTextColor(color);
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
    if (contentRef.current) setContent(contentRef.current.innerHTML);
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const closeAllPickers = () => {
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowTextStylePicker(false);
  };

  const handleAddMindMapNode = (parentId?: string, position?: { x: number, y: number }) => {
    const parent = mindMapNodes.find(n => n.id === parentId);
    
    let x = window.innerWidth / 2 - 75;
    let y = window.innerHeight / 2 - 25;
    
    if (position) {
      x = position.x;
      y = position.y;
    } else if (parent) {
      x = parent.x + 250;
      y = parent.y + (Math.random() * 100 - 50);
    } else if (mindMapNodes.length > 0) {
       const last = mindMapNodes[mindMapNodes.length - 1];
       x = last.x + 50;
       y = last.y + 50;
    }

    const newNode: MindMapNode = {
      id: uuidv4(),
      text: 'New Idea',
      x,
      y,
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      parentId,
      width: 160,
      height: 80
    };
    setMindMapNodes([...mindMapNodes, newNode]);
    setActiveMindMapNodeId(newNode.id);
  };

  const updateMindMapNode = (id: string, updates: Partial<MindMapNode>) => {
    setMindMapNodes(nodes => nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteMindMapNode = (id: string) => {
    const toDelete = new Set<string>([id]);
    let changed = true;
    while (changed) {
      changed = false;
      mindMapNodes.forEach(n => {
        if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
          toDelete.add(n.id);
          changed = true;
        }
      });
    }
    setMindMapNodes(nodes => nodes.filter(n => !toDelete.has(n.id)));
    if (activeMindMapNodeId && toDelete.has(activeMindMapNodeId)) setActiveMindMapNodeId(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'mindmap-canvas') {
       setIsPanning(true);
       setPanStart({ x: e.clientX - mindMapTransform.x, y: e.clientY - mindMapTransform.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setMindMapTransform(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
      return;
    }

    if (isDraggingNode && activeMindMapNodeId) {
      const newX = (e.clientX - dragOffset.x - mindMapTransform.x) / mindMapTransform.scale;
      const newY = (e.clientY - dragOffset.y - mindMapTransform.y) / mindMapTransform.scale;
      updateMindMapNode(activeMindMapNodeId, { x: newX, y: newY });
      return;
    }

    if (tempConnection) {
       const rawX = (e.clientX - mindMapTransform.x) / mindMapTransform.scale;
       const rawY = (e.clientY - mindMapTransform.y) / mindMapTransform.scale;
       setTempConnection(prev => prev ? { ...prev, endX: rawX, endY: rawY } : null);
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    setIsDraggingNode(false);
    
    if (tempConnection) {
       const rawX = (e.clientX - mindMapTransform.x) / mindMapTransform.scale;
       const rawY = (e.clientY - mindMapTransform.y) / mindMapTransform.scale;
       handleAddMindMapNode(tempConnection.startId, { x: rawX, y: rawY - 40 }); 
       setTempConnection(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
       e.preventDefault();
       const scaleAdjustment = -e.deltaY * 0.001;
       const newScale = Math.min(Math.max(0.2, mindMapTransform.scale + scaleAdjustment), 3);
       setMindMapTransform(prev => ({ ...prev, scale: newScale }));
    } else {
       setMindMapTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const handleNodeDragStart = (e: React.MouseEvent, node: MindMapNode) => {
    e.stopPropagation();
    setIsDraggingNode(true);
    setActiveMindMapNodeId(node.id);
    setDragOffset({
      x: e.clientX - (node.x * mindMapTransform.scale) - mindMapTransform.x,
      y: e.clientY - (node.y * mindMapTransform.scale) - mindMapTransform.y
    });
  };

  const handleConnectionDragStart = (e: React.MouseEvent, nodeId: string) => {
     e.stopPropagation();
     const node = mindMapNodes.find(n => n.id === nodeId);
     if (!node) return;
     
     const startX = node.x + (node.width || 160);
     const startY = node.y + (node.height || 80) / 2;
     
     setTempConnection({
        startId: nodeId,
        endX: startX + 50,
        endY: startY
     });
  };

  const getPatternStyle = () => {
    if (paperPattern === 'dots') {
      return {
        backgroundImage: `radial-gradient(#d6d3d1 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      };
    }
    if (paperPattern === 'lines') {
      return {
        backgroundImage: `repeating-linear-gradient(transparent, transparent 29px, #d6d3d1 30px)`,
        backgroundSize: '100% 30px',
        lineHeight: '30px'
      };
    }
    if (paperPattern === 'grid') {
      return {
        backgroundImage: `linear-gradient(#d6d3d1 1px, transparent 1px), linear-gradient(90deg, #d6d3d1 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      };
    }
    return {};
  };

  const loadTemplate = (templateName: string) => {
      const template = MIND_MAP_TEMPLATES.find(t => t.name === templateName);
      if (template) {
          setMindMapNodes(JSON.parse(JSON.stringify(template.nodes))); 
          setMindMapTransform({ x: 0, y: 0, scale: 0.8 }); 
          setShowTemplates(false);
      }
  };

  if (!notebook) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-50">
      {/* Main Editor UI */}
      {!showMindMap && (
        <div className="relative h-full overflow-y-auto custom-scrollbar transition-colors duration-500 pb-32" style={{ backgroundColor: bgColor }}>
           {/* Background Image */}
           {bgImage && (
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                 <img src={bgImage} alt="Background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
           )}
           
           {/* Paper Pattern */}
           <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={getPatternStyle()} />

           {/* Header */}
           <div className="relative z-10">
              <div className="h-48 md:h-64 w-full bg-stone-200 relative group overflow-hidden">
                 {headerCover ? (
                    <img src={headerCover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                       <ImageIcon className="w-8 h-8" />
                    </div>
                 )}
                 <ImageUploader onImageSelect={setHeaderCover} className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Camera className="w-6 h-6 text-white drop-shadow-md" />
                 </ImageUploader>
                 
                 {/* Always visible camera button for mobile */}
                 <div className="absolute bottom-4 right-4 md:hidden">
                   <ImageUploader onImageSelect={setHeaderCover} className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm cursor-pointer">
                       <Camera className="w-5 h-5 text-stone-600" />
                   </ImageUploader>
                 </div>
                 
                 <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-20">
                    <ArrowLeft className="w-5 h-5 text-stone-600" />
                 </button>
              </div>
              
              <div className="max-w-4xl mx-auto px-6 relative">
                 <div className="absolute -top-16 left-6 md:left-10">
                    <div className="relative group">
                       <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-stone-100">
                          {headerAvatar ? (
                             <img src={headerAvatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <User className="w-12 h-12" />
                             </div>
                          )}
                       </div>
                       <ImageUploader onImageSelect={setHeaderAvatar} className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                          <Camera className="w-5 h-5 text-white drop-shadow-md" />
                       </ImageUploader>
                       
                       {/* Always visible camera button for mobile */}
                       <div className="absolute bottom-0 right-0 md:hidden">
                           <ImageUploader onImageSelect={setHeaderAvatar} className="p-1.5 bg-white rounded-full shadow-md border border-stone-200 cursor-pointer">
                               <Camera className="w-4 h-4 text-stone-600" />
                           </ImageUploader>
                       </div>
                    </div>
                 </div>

                 {/* Social Stats Bar */}
                 <div className="absolute top-4 right-6 flex gap-3">
                    <div className="flex flex-col items-center px-4 py-1 bg-[#f9ebe7] rounded-xl shadow-sm">
                       <span className="text-xs font-bold text-stone-700">1.2M</span>
                       <span className="text-[10px] text-stone-500 uppercase tracking-wide">Followers</span>
                    </div>
                    <div className="flex flex-col items-center px-4 py-1 bg-[#f9ebe7] rounded-xl shadow-sm">
                       <span className="text-xs font-bold text-stone-700">482</span>
                       <span className="text-[10px] text-stone-500 uppercase tracking-wide">Following</span>
                    </div>
                    <div className="flex flex-col items-center px-4 py-1 bg-[#f9ebe7] rounded-xl shadow-sm">
                       <span className="text-xs font-bold text-stone-700">8.5M</span>
                       <span className="text-[10px] text-stone-500 uppercase tracking-wide">Likes</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Area */}
           {/* Floating Font Size Tool (Top Right) */}
           <div className="fixed top-24 right-6 z-50">
               <div className="relative flex flex-col items-end">
                   {showFloatingFontTool && (
                       <div className="mb-2 p-3 bg-white shadow-xl rounded-2xl border border-stone-100 animate-in slide-in-from-right-2 origin-right flex items-center gap-3">
                           <span className="text-xs font-medium text-stone-500 w-8">{fontSize}px</span>
                           <input 
                               type="range" 
                               min="12" 
                               max="72" 
                               value={fontSize} 
                               onChange={(e) => setFontSize(parseInt(e.target.value))}
                               className="w-32 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-400"
                           />
                       </div>
                   )}
                   <button 
                       onClick={() => setShowFloatingFontTool(!showFloatingFontTool)}
                       className={`p-3 transition-all duration-300 bg-white rounded-full shadow-md hover:bg-red-50 text-stone-600 ${showFloatingFontTool ? 'bg-red-50 ring-2 ring-red-100 scale-110' : ''}`}
                   >
                       <Heart className={`w-5 h-5 ${showFloatingFontTool ? 'text-red-500 fill-current' : 'text-stone-500'}`} />
                   </button>
               </div>
           </div>
           <div className="max-w-3xl mx-auto px-6 pt-24 relative z-10 pb-20">
              <div 
                 ref={contentRef}
                 contentEditable
                 onInput={handleContentChange}
                 className="min-h-[40vh] outline-none prose prose-stone max-w-none prose-lg mb-8"
                 style={{ 
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily,
                    color: activeTextColor
                 }}
                 suppressContentEditableWarning
              />

              {/* Attachments Grid */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group rounded-2xl overflow-hidden shadow-sm bg-white p-2">
                      {att.type === 'video' ? (
                        <video src={att.url} controls className="w-full h-auto rounded-xl" />
                      ) : (
                        <img src={att.url} alt="Attachment" className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
                      )}
                      
                      {att.analysis && (
                        <div className="mt-2 p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                          <p className="font-bold mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500" /> AI Analysis
                          </p>
                          {att.analysis}
                        </div>
                      )}

                      <button 
                        onClick={() => setAttachments(atts => atts.filter(a => a.id !== att.id))}
                        className="absolute top-4 right-4 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-stone-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => { setSelectedAttachmentId(att.id); setShowAIModal(true); }}
                        className="absolute top-4 right-14 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-purple-50 text-stone-500 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Mind Map UI */}
      <AnimatePresence>
        {showMindMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-stone-50 overflow-hidden"
          >
            {/* Mind Map Toolbar */}
            <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
               <div className="flex gap-2">
                   <button 
                      onClick={() => setShowMindMap(false)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-stone-100"
                   >
                      <ArrowLeft className="w-5 h-5 text-stone-600" />
                   </button>
                   <div className="px-4 py-2 bg-white rounded-full shadow-md font-serif font-medium text-stone-700 flex items-center gap-4">
                      <span>Mind Map</span>
                      <div className="h-4 w-px bg-stone-200" />
                      <div className="flex gap-1">
                         <button onClick={() => setConnectionStyle('curve')} className={`p-1 rounded ${connectionStyle === 'curve' ? 'bg-stone-100' : ''}`} title="Curve">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12c4 0 4 8 8 8s4-8 8-8" /></svg>
                         </button>
                         <button onClick={() => setConnectionStyle('straight')} className={`p-1 rounded ${connectionStyle === 'straight' ? 'bg-stone-100' : ''}`} title="Straight">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20L20 4" /></svg>
                         </button>
                         <button onClick={() => setConnectionStyle('step')} className={`p-1 rounded ${connectionStyle === 'step' ? 'bg-stone-100' : ''}`} title="Step">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h8v-8h8" /></svg>
                         </button>
                      </div>
                   </div>
                   
                   <button 
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="px-4 py-2 bg-white rounded-full shadow-md font-medium text-stone-700 hover:bg-stone-50"
                   >
                      Templates
                   </button>
               </div>

               {showTemplates && (
                   <div className="bg-white rounded-2xl shadow-xl p-4 w-64 max-h-[60vh] overflow-y-auto border border-stone-100 animate-in slide-in-from-top-2">
                       <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">Choose Template</h3>
                       <div className="space-y-2">
                           {MIND_MAP_TEMPLATES.map(t => (
                               <button 
                                  key={t.name}
                                  onClick={() => loadTemplate(t.name)}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-sm text-stone-700 truncate transition-colors"
                               >
                                   {t.name}
                               </button>
                           ))}
                       </div>
                   </div>
               )}
            </div>

            <div className="absolute top-4 right-4 z-50 flex gap-2">
               <button 
                  onClick={() => setMindMapTransform({ x: 0, y: 0, scale: 1 })}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-stone-100 text-stone-600"
                  title="Reset View"
               >
                  <MapPin className="w-5 h-5" />
               </button>
               <button 
                  onClick={() => handleAddMindMapNode(activeMindMapNodeId || undefined)}
                  className="px-4 py-2 bg-stone-800 text-white rounded-full shadow-md hover:bg-stone-900 flex items-center gap-2"
               >
                  <Plus className="w-4 h-4" />
                  <span>Add Node</span>
               </button>
               {activeMindMapNodeId && (
                 <button 
                    onClick={() => deleteMindMapNode(activeMindMapNodeId)}
                    className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
               )}
            </div>

            {/* Transform Container */}
            <div 
               className="absolute inset-0 origin-top-left will-change-transform"
               style={{ 
                  transform: `translate(${mindMapTransform.x}px, ${mindMapTransform.y}px) scale(${mindMapTransform.scale})` 
               }}
            >
                {/* Canvas SVG */}
                <svg className="absolute -inset-[5000px] w-[10000px] h-[10000px] pointer-events-none overflow-visible">
                   {/* Existing Connections */}
                   {mindMapNodes.map(node => {
                     if (!node.parentId) return null;
                     const parent = mindMapNodes.find(n => n.id === node.parentId);
                     if (!parent) return null;
                     
                     // Dynamic center calculation based on assumed or actual size
                     // We use a default size if width/height are missing to prevent jumps
                     const pW = parent.width || 160;
                     const pH = parent.height || 80;
                     const nW = node.width || 160;
                     const nH = node.height || 80;

                     const startX = parent.x + pW / 2;
                     const startY = parent.y + pH / 2;
                     const endX = node.x + nW / 2;
                     const endY = node.y + nH / 2;

                     let d = '';
                     if (connectionStyle === 'curve') {
                        const midX = (startX + endX) / 2;
                        d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
                     } else if (connectionStyle === 'step') {
                        const midX = (startX + endX) / 2;
                        d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
                     } else {
                        d = `M ${startX} ${startY} L ${endX} ${endY}`;
                     }
                     
                     return (
                       <path
                         key={`${parent.id}-${node.id}`}
                         d={d}
                         fill="none"
                         stroke="#d6d3d1"
                         strokeWidth="2"
                       />
                     );
                   })}

                   {/* Temporary Connection Drag */}
                   {tempConnection && (
                      <path 
                         d={`M ${mindMapNodes.find(n => n.id === tempConnection.startId)?.x! + 80} ${mindMapNodes.find(n => n.id === tempConnection.startId)?.y! + 40} L ${tempConnection.endX} ${tempConnection.endY}`}
                         fill="none"
                         stroke="#d6d3d1"
                         strokeWidth="2"
                         strokeDasharray="5,5"
                       />
                   )}
                </svg>

                {/* Nodes */}
                {mindMapNodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute min-w-[160px] min-h-[80px] p-4 rounded-xl shadow-md cursor-move transition-shadow group flex items-center justify-center ${activeMindMapNodeId === node.id ? 'ring-2 ring-stone-400 ring-offset-2 z-10' : 'z-0'}`}
                    style={{ 
                      left: node.x, 
                      top: node.y, 
                      backgroundColor: node.color 
                    }}
                    onMouseDown={(e) => handleNodeDragStart(e, node)}
                    onClick={(e) => { e.stopPropagation(); setActiveMindMapNodeId(node.id); }}
                  >
                     <TextareaAutosize
                        value={node.text}
                        onChange={(e) => updateMindMapNode(node.id, { text: e.target.value })}
                        className="w-full bg-transparent resize-none outline-none text-center font-handwriting text-stone-800 text-sm overflow-hidden"
                        placeholder="Idea..."
                        minRows={2}
                     />
                     
                     {/* Drag Handle to Create Child */}
                     <div
                        onMouseDown={(e) => handleConnectionDragStart(e, node.id)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-100 cursor-crosshair z-20"
                        title="Drag to add child"
                     >
                        <Plus className="w-3 h-3 text-stone-500" />
                     </div>
                  </div>
                ))}
            </div>
            
            {mindMapNodes.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-stone-400">
                     <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
                     <p>Click "Add Node" to start your mind map</p>
                     <p className="text-xs mt-2 opacity-70">Drag from a node's + button to create branches</p>
                  </div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Notes Overlay */}
      {stickyNotes.map((note) => (
        <AnimatePresence key={note.id}>
          {(activeNoteId === note.id) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`absolute z-40 w-64 p-4 shadow-xl rounded-2xl bg-[#fff9c4] border border-yellow-200`}
              style={{ top: '20%', right: '5%' }}
            >
              <div className="flex justify-between items-center mb-3 border-b border-yellow-200/50 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-yellow-800/50 font-bold">Sticky Note</span>
                <div className="flex space-x-1">
                    <button 
                        onClick={() => deleteStickyNote(note.id)} 
                        className="p-1 rounded-full hover:bg-yellow-200 text-yellow-800/50 hover:text-red-600 transition-colors"
                        title="Delete Note"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        onClick={() => setActiveNoteId(null)} 
                        className="p-1 rounded-full hover:bg-yellow-200 text-yellow-800/50 hover:text-yellow-900 transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
              </div>
              <TextareaAutosize
                value={note.text}
                onChange={(e) => updateStickyNote(note.id, e.target.value)}
                className="w-full min-h-[10rem] text-sm bg-transparent border-none resize-none focus:ring-0 font-handwriting text-stone-800 leading-relaxed overflow-hidden"
                placeholder="Write a note..."
                autoFocus
                minRows={5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* Minimized Sticky Notes */}
      <div className="absolute z-30 flex flex-col space-y-3 right-0 top-32 pointer-events-none">
        {stickyNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => setActiveNoteId(note.id)}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center transition-all bg-yellow-200 rounded-l-xl shadow-md hover:w-12 hover:bg-yellow-300 group"
            title="Open Note"
          >
            <StickyNote className="w-5 h-5 text-yellow-700 group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>

      {/* Bottom Toolbar */}
      <div className="relative z-20 bg-white/60 backdrop-blur-xl border-t border-white/20">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
            <button 
                onClick={() => setIsToolbarVisible(!isToolbarVisible)}
                className="flex items-center justify-center w-16 h-6 bg-white/60 backdrop-blur-xl rounded-t-lg border-t border-x border-white/20 text-stone-500 hover:bg-white/80 transition-colors shadow-sm"
            >
                {isToolbarVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
        </div>

        <AnimatePresence initial={false}>
            {isToolbarVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between max-w-3xl mx-auto">
                          <div className="flex flex-wrap gap-6 md:gap-8 justify-center w-full">
                            <button onClick={handleAddStickyNote} className="flex flex-col items-center space-y-1 group">
                              <div className="p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-yellow-50 text-stone-600">
                                <StickyNote className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-medium text-stone-500">Note</span>
                            </button>

                            {/* Mind Map Button */}
                            <button onClick={() => { setShowMindMap(true); if(mindMapNodes.length === 0) handleAddMindMapNode(); }} className="flex flex-col items-center space-y-1 group">
                              <div className="p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-blue-50 text-stone-600">
                                <GitBranch className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-medium text-stone-500">Mind Map</span>
                            </button>
                            
                            {/* Theme Tool */}
                            <div className="relative">
                                <button 
                                    onClick={() => { closeAllPickers(); setShowColorPicker(!showColorPicker); }}
                                    className="flex flex-col items-center space-y-1 group"
                                >
                                    <div className={`p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-stone-100 text-stone-600 ${showColorPicker ? 'bg-stone-100 ring-2 ring-stone-200' : ''}`}>
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-medium text-stone-500">Style</span>
                                </button>

                                {showColorPicker && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-white shadow-xl rounded-xl w-64 z-50 border border-stone-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Page Style</span>
                                            <button onClick={() => setShowColorPicker(false)}><X className="w-3 h-3 text-stone-400" /></button>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <span className="block mb-2 text-xs text-stone-500">Background Color</span>
                                            <div className="grid grid-cols-5 gap-2">
                                                {PASTEL_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setBgColor(c)}
                                                        className={`w-8 h-8 rounded-full border transition-transform hover:scale-110 flex items-center justify-center ${bgColor === c ? 'ring-2 ring-offset-1 ring-stone-800 border-transparent' : 'border-stone-200'}`}
                                                        style={{ backgroundColor: c }}
                                                    >
                                                        {bgColor === c && <Check className="w-3 h-3 text-stone-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="block mb-2 text-xs text-stone-500">Pattern</span>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['none', 'dots', 'lines', 'grid'].map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPaperPattern(p as any)}
                                                        className={`h-8 rounded-lg border text-xs capitalize transition-colors ${paperPattern === p ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Combined Typography Tool (Heart) */}
                            <div className="relative">
                                <button 
                                    onClick={() => { closeAllPickers(); setShowTextStylePicker(!showTextStylePicker); }}
                                    className="flex flex-col items-center space-y-1 group"
                                >
                                    <div className={`p-3 transition-all duration-300 bg-white rounded-full shadow-sm group-hover:bg-red-50 text-stone-600 ${showTextStylePicker ? 'bg-red-50 ring-2 ring-red-100 scale-110' : ''}`}>
                                        <Heart className={`w-5 h-5 ${showTextStylePicker ? 'text-red-500 fill-current' : 'text-stone-500'}`} />
                                    </div>
                                    <span className="text-[10px] font-medium text-stone-500">Text</span>
                                </button>

                                {showTextStylePicker && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-white shadow-xl rounded-2xl w-80 z-50 border border-stone-100 animate-in zoom-in-95 duration-200 origin-bottom">
                                        <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                                                <Heart className="w-3 h-3 text-red-400 fill-current" />
                                                Typography
                                            </span>
                                            <button onClick={() => setShowTextStylePicker(false)} className="hover:bg-stone-100 p-1 rounded-full"><X className="w-3 h-3 text-stone-400" /></button>
                                        </div>
                                        
                                        {/* Font Size Slider */}
                                        <div className="mb-5">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-medium text-stone-500">Size</span>
                                                <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{fontSize}px</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => setFontSize(s => Math.max(12, s - 1))} className="p-1 hover:bg-stone-100 rounded"><Minus className="w-3 h-3 text-stone-400" /></button>
                                                <input 
                                                    type="range" 
                                                    min="12" 
                                                    max="72" 
                                                    value={fontSize} 
                                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                    className="flex-1 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-400"
                                                />
                                                <button onClick={() => setFontSize(s => Math.min(72, s + 1))} className="p-1 hover:bg-stone-100 rounded"><Plus className="w-3 h-3 text-stone-400" /></button>
                                            </div>
                                        </div>

                                        {/* Font Family Selection */}
                                        <div className="mb-5">
                                            <span className="block mb-2 text-xs font-medium text-stone-500">Font Family</span>
                                            <div className="h-32 overflow-y-auto custom-scrollbar border border-stone-200 rounded-xl p-1 grid grid-cols-1 gap-1">
                                                <button 
                                                    onClick={() => setFontFamily('Inter')}
                                                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${fontFamily === 'Inter' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    style={{ fontFamily: 'Inter' }}
                                                >
                                                    <span>Default (Inter)</span>
                                                    {fontFamily === 'Inter' && <Check className="w-3 h-3" />}
                                                </button>
                                                {AVAILABLE_FONTS.map(font => (
                                                    <button 
                                                        key={font}
                                                        onClick={() => setFontFamily(font)}
                                                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${fontFamily === font ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                        style={{ fontFamily: font }}
                                                    >
                                                        <span className="truncate">{font}</span>
                                                        {fontFamily === font && <Check className="w-3 h-3" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Text Color */}
                                        <div>
                                            <span className="block mb-2 text-xs font-medium text-stone-500">Color</span>
                                            <div className="flex flex-wrap gap-2">
                                                {TEXT_COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => handleTextColorChange(c)}
                                                        className={`w-8 h-8 rounded-full border transition-transform hover:scale-110 flex items-center justify-center ${activeTextColor === c ? 'ring-2 ring-offset-1 ring-stone-800 border-transparent' : 'border-stone-200'}`}
                                                        style={{ backgroundColor: c }}
                                                    >
                                                        {activeTextColor === c && <Check className="w-3 h-3 text-stone-600 invert" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Highlight Tool */}
                            <div className="relative">
                                <button 
                                    onClick={() => { closeAllPickers(); setShowHighlightPicker(!showHighlightPicker); }}
                                    className="flex flex-col items-center space-y-1 group"
                                >
                                    <div className={`p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-pink-50 text-stone-600 relative ${showHighlightPicker ? 'bg-pink-50 ring-2 ring-pink-100' : ''}`}>
                                        <Highlighter className="w-5 h-5" />
                                        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full ring-1 ring-white" style={{ backgroundColor: activeHighlightColor }} />
                                    </div>
                                    <span className="text-[10px] font-medium text-stone-500">Highlight</span>
                                </button>

                                {showHighlightPicker && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-white shadow-xl rounded-xl w-64 z-50 border border-stone-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Highlight Color</span>
                                            <button onClick={() => setShowHighlightPicker(false)}><X className="w-3 h-3 text-stone-400" /></button>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2 mb-3">
                                            {HIGHLIGHT_COLORS.map(c => (
                                                <button 
                                                    key={c} 
                                                    onClick={() => setActiveHighlightColor(c)}
                                                    className={`w-8 h-8 rounded-full border transition-transform hover:scale-110 ${activeHighlightColor === c ? 'ring-2 ring-offset-1 ring-stone-800 border-transparent' : 'border-stone-200'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => { handleHighlightSelection(); setShowHighlightPicker(false); }}
                                            className="w-full py-2 text-xs font-medium text-white bg-stone-800 rounded-lg hover:bg-stone-700"
                                        >
                                            Apply to Selection
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <ImageUploader onImageSelect={(url) => handleAddAttachment(url)} className="flex flex-col items-center space-y-1 group">
                                <div className="p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-blue-50 text-stone-600">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-medium text-stone-500">Photo</span>
                            </ImageUploader>

                            <button 
                                onClick={() => { setShowPhotoAlbum(true); }}
                                className="flex flex-col items-center space-y-1 group"
                            >
                              <div className="p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-orange-50 text-orange-600">
                                <Album className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-medium text-orange-500">Album</span>
                            </button>

                            <button 
                                onClick={() => { setSelectedAttachmentId(null); setShowAIModal(true); }}
                                className="flex flex-col items-center space-y-1 group"
                            >
                              <div className="p-3 transition-colors bg-white rounded-full shadow-sm group-hover:bg-purple-50 text-purple-600">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-medium text-purple-500">AI Create</span>
                            </button>

                            {/* Add to Memory Keeper Button */}
                            <button 
                                onClick={handleAddToMemoryKeeper}
                                className="flex flex-col items-center space-y-1 group"
                            >
                                <div className="p-3 transition-all duration-300 bg-teal-500 rounded-full shadow-md group-hover:bg-teal-600 group-hover:scale-110 text-white ring-4 ring-teal-100">
                                <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-teal-600 mt-1">Add to Keep</span>
                            </button>

                          </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <PhotoAlbum 
        isOpen={showPhotoAlbum}
        onClose={() => setShowPhotoAlbum(false)}
        cards={photoCards}
        onUpdateCards={setPhotoCards}
        albumCover={albumCover}
        onUpdateCover={setAlbumCover}
        albumAvatar={albumAvatar}
        onUpdateAvatar={setAlbumAvatar}
      />

      <AIModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        selectedImage={selectedAttachmentId ? attachments.find(a => a.id === selectedAttachmentId)?.url : undefined}
        onImageGenerated={(url) => handleAddAttachment(url, 'image')}
        onVideoGenerated={(url) => handleAddAttachment(url, 'video')}
        onAnalysisResult={(text) => {
            if (selectedAttachmentId) {
                setAttachments(atts => atts.map(a => a.id === selectedAttachmentId ? { ...a, analysis: text } : a));
            }
        }}
        onSearchResult={(text) => {
            setContent(prev => prev + `\n\n--- AI Context ---\n${text}`);
        }}
      />
    </div>
  );
}

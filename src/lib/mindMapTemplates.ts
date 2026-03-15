import { v4 as uuidv4 } from 'uuid';

export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId?: string;
  width?: number;
  height?: number;
}

const COLORS = [
  '#faf2f0', '#f9ebe7', '#f9e5df', '#faf0f0', '#f9e7e7', 
  '#f9dfdf', '#faf0f2', '#f9e7eb', '#f9dfe5', '#e0f2f1',
  '#e8f5e9', '#fff3e0', '#f3e5f5', '#e1f5fe', '#fffde7'
];

const generateId = () => uuidv4();

const createNode = (text: string, x: number, y: number, color?: string, parentId?: string): MindMapNode => ({
  id: generateId(),
  text,
  x,
  y,
  color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
  parentId,
  width: 160,
  height: 80
});

export const MIND_MAP_TEMPLATES: { name: string; nodes: MindMapNode[] }[] = [];

// Helper to generate radial layout
const createRadialTemplate = (name: string, centerText: string, branches: string[], subBranches: string[] = []) => {
  const nodes: MindMapNode[] = [];
  const centerX = window.innerWidth / 2 - 80;
  const centerY = window.innerHeight / 2 - 40;
  
  const centerNode = createNode(centerText, centerX, centerY, '#ffebee');
  nodes.push(centerNode);

  const radius = 300;
  const angleStep = (2 * Math.PI) / branches.length;

  branches.forEach((branchText, i) => {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const branchNode = createNode(branchText, x, y, COLORS[i % COLORS.length], centerNode.id);
    nodes.push(branchNode);

    // Add sub-branches
    if (subBranches.length > 0) {
        const subRadius = 200;
        const subAngleSpread = 0.5;
        subBranches.forEach((subText, j) => {
            const subAngle = angle - subAngleSpread/2 + (j * subAngleSpread / (subBranches.length - 1 || 1));
            const subX = x + subRadius * Math.cos(subAngle);
            const subY = y + subRadius * Math.sin(subAngle);
            nodes.push(createNode(subText, subX, subY, COLORS[i % COLORS.length], branchNode.id));
        });
    }
  });

  MIND_MAP_TEMPLATES.push({ name, nodes });
};

// Helper to generate tree layout (top-down)
const createTreeTemplate = (name: string, rootText: string, levels: number[]) => {
    const nodes: MindMapNode[] = [];
    const startX = window.innerWidth / 2 - 80;
    const startY = 100;
    
    const rootNode = createNode(rootText, startX, startY, '#e3f2fd');
    nodes.push(rootNode);

    let currentLevelNodes = [rootNode];
    let yOffset = 200;

    levels.forEach((count, levelIndex) => {
        const nextLevelNodes: MindMapNode[] = [];
        const totalWidth = count * 200;
        let xOffset = startX - totalWidth / 2 + 100;

        currentLevelNodes.forEach((parent) => {
            const childrenCount = Math.ceil(count / currentLevelNodes.length);
            for (let i = 0; i < childrenCount; i++) {
                if (nextLevelNodes.length >= count) break;
                const node = createNode(`Level ${levelIndex + 1}`, xOffset, startY + yOffset, COLORS[(levelIndex + i) % COLORS.length], parent.id);
                nodes.push(node);
                nextLevelNodes.push(node);
                xOffset += 200;
            }
        });
        currentLevelNodes = nextLevelNodes;
        yOffset += 200;
    });

    MIND_MAP_TEMPLATES.push({ name, nodes });
};

// Helper to generate logic chart (left-to-right)
const createLogicTemplate = (name: string, rootText: string, branches: number) => {
    const nodes: MindMapNode[] = [];
    const startX = 100;
    const startY = window.innerHeight / 2;
    
    const rootNode = createNode(rootText, startX, startY, '#f3e5f5');
    nodes.push(rootNode);

    const verticalSpacing = 150;
    const totalHeight = branches * verticalSpacing;
    let currentY = startY - totalHeight / 2;

    for (let i = 0; i < branches; i++) {
        const mainBranch = createNode(`Main Point ${i+1}`, startX + 300, currentY, COLORS[i % COLORS.length], rootNode.id);
        nodes.push(mainBranch);
        
        // Add some sub-points
        nodes.push(createNode('Detail A', startX + 600, currentY - 40, COLORS[i % COLORS.length], mainBranch.id));
        nodes.push(createNode('Detail B', startX + 600, currentY + 40, COLORS[i % COLORS.length], mainBranch.id));

        currentY += verticalSpacing;
    }

    MIND_MAP_TEMPLATES.push({ name, nodes });
};

// Generate 50 Templates
for (let i = 1; i <= 15; i++) {
    createRadialTemplate(`Radial Strategy ${i}`, 'Core Concept', 
        Array(4 + (i % 5)).fill('Strategy'), 
        Array(2 + (i % 3)).fill('Tactic')
    );
}

for (let i = 1; i <= 15; i++) {
    createTreeTemplate(`Org Chart ${i}`, 'CEO / Leader', [2 + (i%3), 4 + (i%4), 8]);
}

for (let i = 1; i <= 20; i++) {
    createLogicTemplate(`Project Plan ${i}`, 'Project Goal', 3 + (i % 4));
}

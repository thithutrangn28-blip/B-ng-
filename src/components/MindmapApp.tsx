import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Grid, List, Search, Map as MapIcon, Maximize, Minimize, Settings2, Store, Eye, EyeOff, Camera, Maximize2, Minimize2 } from 'lucide-react';
import { db } from '@/lib/db';
import { ImageUploader } from './ImageUploader';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  NodeProps,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextareaAutosize from 'react-textarea-autosize';

const MINDMAP_STYLES = [
  { id: 'style1', name: 'Logic (Logic)', edgeType: 'step', borderStyle: 'solid', borderWidth: 2, borderRadius: '0.25rem' },
  { id: 'style2', name: 'Creative (Sáng tạo)', edgeType: 'default', borderStyle: 'solid', borderWidth: 2, borderRadius: '9999px' },
  { id: 'style3', name: 'Structured (Cấu trúc)', edgeType: 'straight', borderStyle: 'solid', borderWidth: 2, borderRadius: '0.5rem' },
  { id: 'style4', name: 'Freeflow (Tự do)', edgeType: 'smoothstep', borderStyle: 'dashed', borderWidth: 2, borderRadius: '0.75rem' },
  { id: 'style5', name: 'Analytical (Phân tích)', edgeType: 'step', borderStyle: 'dotted', borderWidth: 3, borderRadius: '0.25rem' },
  { id: 'style6', name: 'Visionary (Tầm nhìn)', edgeType: 'default', borderStyle: 'solid', borderWidth: 4, borderRadius: '1rem' },
  { id: 'style7', name: 'Minimalist (Tối giản)', edgeType: 'straight', borderStyle: 'solid', borderWidth: 1, borderRadius: '0' },
  { id: 'style8', name: 'Organic (Hữu cơ)', edgeType: 'smoothstep', borderStyle: 'solid', borderWidth: 1, borderRadius: '1.5rem' },
  { id: 'style9', name: 'Systematic (Hệ thống)', edgeType: 'straight', borderStyle: 'double', borderWidth: 4, borderRadius: '0.5rem' },
  { id: 'style10', name: 'Dynamic (Năng động)', edgeType: 'default', borderStyle: 'dashed', borderWidth: 3, borderRadius: '9999px' },
  { id: 'style11', name: 'Sequential (Tuần tự)', edgeType: 'step', borderStyle: 'solid', borderWidth: 2, borderRadius: '0' },
  { id: 'style12', name: 'Abstract (Trừu tượng)', edgeType: 'straight', borderStyle: 'dashed', borderWidth: 1, borderRadius: '9999px' },
  { id: 'style13', name: 'Focused (Tập trung)', edgeType: 'smoothstep', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 3, borderRadius: '0' },
  { id: 'style14', name: 'Expansive (Mở rộng)', edgeType: 'default', borderStyle: 'solid', borderWidth: 6, borderRadius: '0.5rem' },
  { id: 'style15', name: 'Connected (Kết nối)', edgeType: 'smoothstep', borderStyle: 'dotted', borderWidth: 2, borderRadius: '9999px' },
];

const MINDMAP_COLORS = [
  '#faf2f0',
  '#f9ebe7',
  '#f9e5df',
  '#faf0f0',
  '#f9e7e7',
  '#f9dfdf',
  '#faf0f2',
  '#f9e7eb',
  '#f9dfe5',
  '#ffffff'
];

const LAYOUT_TYPES = [
  { id: 'tree', name: 'Dạng Cây (Tree Map)', icon: '🌲', description: 'Phân nhánh theo cấu trúc rễ cây từ trên xuống hoặc trái sang phải.' },
  { id: 'circle', name: 'Dạng Vòng tròn (Circle Map)', icon: '⭕', description: 'Phân nhánh tỏa tròn đều xung quanh ý tưởng trung tâm.' },
  { id: 'bubble', name: 'Dạng Bong bóng (Bubble Map)', icon: '💭', description: 'Các nhánh nổi tự do như bong bóng xung quanh.' },
  { id: 'double_bubble', name: 'Dạng Bong bóng kép (Double Bubble Map)', icon: '🫧', description: 'Hai trung tâm kết nối để so sánh và đối chiếu.' },
  { id: 'bridge', name: 'Dạng Cầu (Bridge Map)', icon: '🌉', description: 'Phân nhánh theo đường thẳng nối tiếp nhau như cây cầu.' },
  { id: 'cloud', name: 'Dạng Đám mây (Cloud Map)', icon: '☁️', description: 'Các nhánh tụ tập thành từng cụm như đám mây.' },
];

// Custom Node Component
const MindmapNode = ({ data, id, isConnectable, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();
  
  const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    if ((data as any).onChange) {
      (data as any).onChange(id, evt.target.value);
    }
  };

  const onAddChild = (direction: 'top' | 'right' | 'bottom' | 'left') => {
    if ((data as any).onAddChild) {
      (data as any).onAddChild(id, direction);
    }
  };

  const onDelete = () => {
    if ((data as any).onDelete) {
      (data as any).onDelete(id);
    }
  };

  const onExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, isFocused: true } };
        }
        return node;
      })
    );
  };

  const onToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, isCollapsed: !node.data.isCollapsed } };
        }
        return node;
      })
    );
  };

  const style = data.themeStyle as any || MINDMAP_STYLES[0];
  const bgColor = data.themeColor as string || MINDMAP_COLORS[0];
  const isCollapsed = data.isCollapsed as boolean;
  const label = (data.label as string) || '';
  const isLongText = label.length > 50;

  return (
    <div 
      className={`shadow-sm min-w-[150px] group relative transition-all duration-300 ${selected ? 'ring-4 ring-stone-400/50 scale-105' : ''}`}
      style={{
        backgroundColor: bgColor,
        borderStyle: style.borderStyle,
        borderWidth: style.borderBottomWidth !== undefined ? `0 0 ${style.borderBottomWidth}px 0` : `${style.borderWidth}px`,
        borderColor: '#292524',
        borderRadius: style.borderRadius,
      }}
    >
      <Handle type="source" position={Position.Top} id="top" isConnectable={isConnectable} className="w-3 h-3 bg-stone-800 opacity-0 group-hover:opacity-50 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} className="w-3 h-3 bg-stone-800 opacity-0 group-hover:opacity-50 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} className="w-3 h-3 bg-stone-800 opacity-0 group-hover:opacity-50 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} className="w-3 h-3 bg-stone-800 opacity-0 group-hover:opacity-50 transition-opacity" />
      
      <div className={`p-3 flex flex-col ${isCollapsed ? 'max-h-16 overflow-hidden' : ''} transition-all duration-300`}>
        <TextareaAutosize
          value={label}
          onChange={onChange}
          placeholder="Idea..."
          className="nodrag w-full resize-none outline-none bg-transparent text-center font-medium text-stone-800"
          minRows={1}
        />
        {isLongText && (
          <button 
            onClick={onToggleCollapse}
            className="mt-1 text-[9px] font-bold text-stone-500 hover:text-stone-800 uppercase tracking-tighter flex items-center justify-center gap-1"
          >
            {isCollapsed ? 'Xem thêm' : 'Thu gọn'}
          </button>
        )}
      </div>

      {/* Add buttons on 4 sides - visible when selected or hovered */}
      <div className={`absolute -top-5 left-1/2 -translate-x-1/2 transition-all duration-200 z-10 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
        <button onClick={() => onAddChild('top')} className="w-6 h-6 bg-[#f9e5df] text-stone-800 rounded-full flex items-center justify-center hover:bg-[#f0d5ce] shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Phân nhánh lên trên"><Plus className="w-4 h-4" /></button>
      </div>
      <div className={`absolute -right-5 top-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
        <button onClick={() => onAddChild('right')} className="w-6 h-6 bg-[#f9e5df] text-stone-800 rounded-full flex items-center justify-center hover:bg-[#f0d5ce] shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Phân nhánh sang phải"><Plus className="w-4 h-4" /></button>
      </div>
      <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 transition-all duration-200 z-10 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
        <button onClick={() => onAddChild('bottom')} className="w-6 h-6 bg-[#f9e5df] text-stone-800 rounded-full flex items-center justify-center hover:bg-[#f0d5ce] shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Phân nhánh xuống dưới"><Plus className="w-4 h-4" /></button>
      </div>
      <div className={`absolute -left-5 top-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${selected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
        <button onClick={() => onAddChild('left')} className="w-6 h-6 bg-[#f9e5df] text-stone-800 rounded-full flex items-center justify-center hover:bg-[#f0d5ce] shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Phân nhánh sang trái"><Plus className="w-4 h-4" /></button>
      </div>

      {/* Delete button */}
      {id !== 'root' && (
        <div className={`absolute -top-3 -right-3 transition-opacity duration-200 z-10 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button onClick={onDelete} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Xóa nhánh"><Trash2 className="w-3 h-3" /></button>
        </div>
      )}

      {/* Expand button */}
      <div className={`absolute -top-3 -left-3 transition-opacity duration-200 z-10 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button onClick={onExpand} className="w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-stone-700 shadow-lg cursor-pointer transform hover:scale-110 transition-transform" title="Phóng to để viết"><Maximize2 className="w-3 h-3" /></button>
      </div>
    </div>
  );
};

const nodeTypes = {
  mindmap: MindmapNode,
};

interface MindmapAppProps {
  onBack: () => void;
}

interface MindmapData {
  id: string;
  content: string; // Title
  createdAt: string;
  notebookId: string;
  nodes: Node[];
  edges: Edge[];
  themeStyleId?: string;
  themeColor?: string;
  layoutType?: string;
  coverImage?: string;
  avatarImage?: string;
  cardColor?: string;
  cardImage?: string;
}

const initialNodes: Node[] = [
  {
    id: 'root',
    type: 'mindmap',
    position: { x: 250, y: 250 },
    data: { label: 'Central Idea' },
  },
];

const initialEdges: Edge[] = [];

function MindmapEditor({ 
  mindmap, 
  onBack, 
  onSave 
}: { 
  mindmap: MindmapData; 
  onBack: () => void; 
  onSave: (data: MindmapData) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(mindmap.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mindmap.edges || initialEdges);
  const [title, setTitle] = useState(mindmap.content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [themeStyleId, setThemeStyleId] = useState(mindmap.themeStyleId || MINDMAP_STYLES[0].id);
  const [themeColor, setThemeColor] = useState(mindmap.themeColor || MINDMAP_COLORS[0]);
  const [layoutType, setLayoutType] = useState(mindmap.layoutType || LAYOUT_TYPES[0].id);
  const [showUIControls, setShowUIControls] = useState(true);
  const [coverImage, setCoverImage] = useState(mindmap.coverImage);
  const [avatarImage, setAvatarImage] = useState(mindmap.avatarImage);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...mindmap,
        content: title,
        nodes,
        edges,
        themeStyleId,
        themeColor,
        layoutType,
        coverImage,
        avatarImage,
        cardColor: mindmap.cardColor,
        cardImage: mindmap.cardImage
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges, title, themeStyleId, themeColor, layoutType, coverImage, avatarImage, mindmap.cardColor, mindmap.cardImage]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#292524', strokeWidth: 2 } } as any, eds)),
    [setEdges],
  );

  const { getNode, getEdges } = useReactFlow();

  const handleNodeChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const focusedNode = nodes.find(n => n.data.isFocused);
  const closeFocusMode = () => {
    setNodes(nds => nds.map(n => n.data.isFocused ? { ...n, data: { ...n.data, isFocused: false } } : n));
  };

  const applyLayout = useCallback((type: string) => {
    setLayoutType(type);
    setShowStore(false);
    
    setNodes((currentNodes) => {
      const childrenMap = new Map<string, string[]>();
      edges.forEach(e => {
        if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
        childrenMap.get(e.source)!.push(e.target);
      });

      const newNodes = currentNodes.map(n => ({ ...n, position: { ...n.position } }));
      const nodeMap = new Map<string, Node>(newNodes.map((n) => [n.id, n]));

      let rootId = newNodes.find((n) => n.id === 'root')?.id;
      if (!rootId && newNodes.length > 0) rootId = newNodes[0].id;
      if (!rootId) return currentNodes;

      const positionChildren = (parentId: string, baseAngle: number) => {
        const children = childrenMap.get(parentId) || [];
        const count = children.length;
        if (count === 0) return;

        children.forEach((childId, index) => {
          let radius = 220;
          let spread = 60;
          let offset = 0;

          switch (type) {
            case 'tree':
              radius = 200 + Math.floor(index / 4) * 100;
              spread = 45;
              offset = (index % 4) * (spread / 2) * (index % 2 === 0 ? 1 : -1);
              break;
            case 'circle':
              radius = 250 + Math.floor(index / 6) * 80;
              spread = 360 / Math.max(6, count);
              offset = index * spread;
              break;
            case 'bubble':
              radius = 180 + Math.random() * 100 + Math.floor(index / 3) * 120;
              spread = 70;
              offset = (index % 3) * (spread / 2) * (index % 2 === 0 ? 1 : -1) + (Math.random() * 20 - 10);
              break;
            case 'double_bubble':
              radius = 250 + Math.floor(index / 3) * 100;
              spread = 90;
              offset = (index % 3) * (spread / 2) * (index % 2 === 0 ? 1 : -1);
              break;
            case 'bridge':
              radius = 200 + index * 200;
              spread = 0;
              offset = 0;
              break;
            case 'cloud':
              radius = 150 + Math.random() * 150 + Math.floor(index / 4) * 100;
              spread = 80;
              offset = (index % 4) * (spread / 2) * (index % 2 === 0 ? 1 : -1) + (Math.random() * 40 - 20);
              break;
            default:
              radius = 220 + Math.floor(index / 3) * 100;
              spread = 60;
              offset = (index % 3) * (spread / 2) * (index % 2 === 0 ? 1 : -1);
          }

          let finalAngle = baseAngle + offset;
          
          if (parentId === rootId) {
             if (type === 'bridge') {
                finalAngle = 0; 
             } else {
                finalAngle = (index * (360 / Math.max(1, count))) % 360;
             }
          }

          const angleRad = finalAngle * (Math.PI / 180);
          const parentNode = nodeMap.get(parentId);
          const childNode = nodeMap.get(childId);

          if (parentNode && childNode) {
            childNode.position = {
              x: parentNode.position.x + Math.cos(angleRad) * radius,
              y: parentNode.position.y + Math.sin(angleRad) * radius
            };
            positionChildren(childId, finalAngle);
          }
        });
      };

      positionChildren(rootId, 0);
      return newNodes;
    });
  }, [edges, setNodes]);

  const handleAddChild = useCallback((parentId: string, direction: 'top' | 'right' | 'bottom' | 'left' = 'right') => {
    const parentNode = getNode(parentId);
    if (!parentNode) return;

    const currentEdges = getEdges();
    const childrenEdges = currentEdges.filter(e => e.source === parentId);
    
    let baseAngle = 0;
    switch (direction) {
      case 'top': baseAngle = -90; break;
      case 'right': baseAngle = 0; break;
      case 'bottom': baseAngle = 90; break;
      case 'left': baseAngle = 180; break;
    }

    // Find children that were added in this general direction
    const childrenInDirection = childrenEdges.filter(e => {
        const childNode = getNode(e.target);
        if (!childNode) return false;
        const dx = childNode.position.x - parentNode.position.x;
        const dy = childNode.position.y - parentNode.position.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Normalize angle to 0-360
        const normAngle = (angle + 360) % 360;
        const normBase = (baseAngle + 360) % 360;
        // Check if within 45 degrees
        let diff = Math.abs(normAngle - normBase);
        if (diff > 180) diff = 360 - diff;
        return diff <= 45;
    });

    const count = childrenInDirection.length;
    let radius = 220;
    let spread = 60;
    let offset = 0;

    switch (layoutType) {
      case 'tree':
        radius = 200 + Math.floor(count / 4) * 100;
        spread = 45;
        offset = (count % 4) * (spread / 2) * (count % 2 === 0 ? 1 : -1);
        break;
      case 'circle':
        radius = 250 + Math.floor(count / 6) * 80;
        spread = 360 / Math.max(6, childrenEdges.length + 1);
        offset = count * spread;
        break;
      case 'bubble':
        radius = 180 + Math.random() * 100 + Math.floor(count / 3) * 120;
        spread = 70;
        offset = (count % 3) * (spread / 2) * (count % 2 === 0 ? 1 : -1) + (Math.random() * 20 - 10);
        break;
      case 'double_bubble':
        radius = 250 + Math.floor(count / 3) * 100;
        spread = 90;
        offset = (count % 3) * (spread / 2) * (count % 2 === 0 ? 1 : -1);
        break;
      case 'bridge':
        radius = 200 + count * 200; // Linear extension
        spread = 0;
        offset = 0;
        break;
      case 'cloud':
        radius = 150 + Math.random() * 150 + Math.floor(count / 4) * 100;
        spread = 80;
        offset = (count % 4) * (spread / 2) * (count % 2 === 0 ? 1 : -1) + (Math.random() * 40 - 20);
        break;
      default:
        radius = 220 + Math.floor(count / 3) * 100;
        spread = 60;
        offset = (count % 3) * (spread / 2) * (count % 2 === 0 ? 1 : -1);
    }

    const finalAngle = baseAngle + offset;

    const angleRad = finalAngle * (Math.PI / 180);
    const newNodeId = crypto.randomUUID();

    const newNode: Node = {
      id: newNodeId,
      type: 'mindmap',
      position: { 
        x: parentNode.position.x + Math.cos(angleRad) * radius, 
        y: parentNode.position.y + Math.sin(angleRad) * radius 
      },
      data: { label: '' },
    };

    setNodes((nds) => [...nds, newNode]);
    
    // Determine source and target handles based on direction
    let sourceHandle = 'right';
    let targetHandle = 'left';
    
    switch (direction) {
      case 'top': sourceHandle = 'top'; targetHandle = 'bottom'; break;
      case 'right': sourceHandle = 'right'; targetHandle = 'left'; break;
      case 'bottom': sourceHandle = 'bottom'; targetHandle = 'top'; break;
      case 'left': sourceHandle = 'left'; targetHandle = 'right'; break;
    }

    setEdges((eds) => addEdge({
      id: `e-${parentId}-${newNodeId}`,
      source: parentId,
      sourceHandle: sourceHandle,
      target: newNodeId,
      targetHandle: targetHandle,
      animated: true,
    } as Edge, eds));
  }, [getNode, getEdges, setNodes, setEdges]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  // Inject callbacks and styles into node data
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      themeStyle: MINDMAP_STYLES.find(s => s.id === themeStyleId) || MINDMAP_STYLES[0],
      themeColor: themeColor,
      onChange: handleNodeChange,
      onAddChild: handleAddChild,
      onDelete: handleDeleteNode
    }
  }));

  const activeStyle = MINDMAP_STYLES.find(s => s.id === themeStyleId) || MINDMAP_STYLES[0];
  const edgesWithStyles = edges.map(edge => ({
    ...edge,
    type: activeStyle.edgeType,
    style: {
      stroke: '#292524',
      strokeWidth: activeStyle.borderWidth,
      strokeDasharray: activeStyle.borderStyle === 'dashed' ? '5,5' : activeStyle.borderStyle === 'dotted' ? '2,2' : 'none'
    }
  }));

  return (
    <div className={`flex flex-col bg-[#faf0f0] ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'h-full relative'}`}>
      {/* Header */}
      <div 
        className="relative flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200 z-10 shadow-sm"
        style={{
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: coverImage ? '120px' : 'auto',
          alignItems: coverImage ? 'flex-start' : 'center'
        }}
      >
        {coverImage && <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0" />}
        
        <div className="relative z-10 flex items-center w-full">
          <button onClick={onBack} className={`p-2 -ml-2 rounded-full hover:bg-stone-100/20 ${coverImage ? 'text-white' : 'text-stone-600'}`}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 border-2 border-white shadow-sm flex items-center justify-center">
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <MapIcon className="w-5 h-5 text-stone-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <ImageUploader onImageSelect={setAvatarImage} className="w-full h-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </ImageUploader>
              </div>
            </div>
            
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`font-bold text-lg text-center bg-transparent outline-none ${coverImage ? 'text-white placeholder-white/70' : 'text-stone-800'}`}
              placeholder="Mindmap Title"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className={`p-2 rounded-full hover:bg-stone-100/20 ${coverImage ? 'text-white' : 'text-stone-600'}`} title="Đổi ảnh bìa">
                <ImageUploader onImageSelect={setCoverImage}>
                  <Camera className="w-5 h-5" />
                </ImageUploader>
              </button>
            </div>
            <button 
              onClick={() => { setShowStore(!showStore); setShowSettings(false); }}
              className={`p-2 rounded-full hover:bg-stone-100/20 flex items-center gap-1 ${coverImage ? 'text-white' : 'text-stone-600'}`}
              title="Cửa hàng kiểu phân nhánh"
            >
              <Store className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setShowSettings(!showSettings); setShowStore(false); }}
              className={`p-2 rounded-full hover:bg-stone-100/20 ${coverImage ? 'text-white' : 'text-stone-600'}`}
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 -mr-2 rounded-full hover:bg-stone-100/20 ${coverImage ? 'text-white' : 'text-stone-600'}`}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Store Panel */}
      {showStore && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-5 z-50 max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5" /> Cửa hàng Kiểu Phân Nhánh
          </h3>
          
          <div className="flex flex-col gap-3">
            {LAYOUT_TYPES.map(layout => (
              <button
                key={layout.id}
                onClick={() => applyLayout(layout.id)}
                className={`p-3 text-left rounded-xl border transition-all ${layoutType === layout.id ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{layout.icon}</span>
                  <span className="font-bold text-sm">{layout.name}</span>
                </div>
                <p className={`text-xs ${layoutType === layout.id ? 'text-stone-300' : 'text-stone-500'}`}>
                  {layout.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-5 z-50">
          <h3 className="font-bold text-stone-800 mb-4">Mindmap Style</h3>
          
          <div className="mb-5">
            <label className="text-xs font-medium text-stone-500 mb-2 block">Branch Template (10 Styles)</label>
            <div className="grid grid-cols-2 gap-2">
              {MINDMAP_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setThemeStyleId(style.id)}
                  className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${themeStyleId === style.id ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-2 block">Node Color</label>
            <div className="flex flex-wrap gap-2">
              {MINDMAP_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === color ? 'border-stone-800 scale-110' : 'border-transparent shadow-sm'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 w-full relative">
        <button 
          onClick={() => setShowUIControls(!showUIControls)}
          className="absolute bottom-4 right-4 z-[50] p-3 bg-white rounded-full shadow-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
          title={showUIControls ? "Ẩn thanh điều khiển" : "Hiện thanh điều khiển"}
        >
          {showUIControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>

        {focusedNode && (
          <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf0f0] w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
            >
              <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white/50 backdrop-blur-md">
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-stone-500" />
                  Tập trung viết
                </h3>
                <button 
                  onClick={closeFocusMode}
                  className="p-2 bg-white rounded-full hover:bg-stone-100 text-stone-600 transition-colors shadow-sm"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
              <textarea
                className="flex-1 w-full p-8 resize-none outline-none text-xl leading-relaxed bg-transparent text-stone-800 placeholder-stone-400 custom-scrollbar"
                value={focusedNode.data.label as string}
                onChange={(e) => handleNodeChange(focusedNode.id, e.target.value)}
                placeholder="Nhập nội dung ý tưởng của bạn..."
                autoFocus
              />
            </motion.div>
          </div>
        )}

        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edgesWithStyles}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          minZoom={0.1}
          maxZoom={4}
          defaultEdgeOptions={{ type: activeStyle.edgeType, animated: true, style: { stroke: '#292524', strokeWidth: activeStyle.borderWidth } }}
        >
          <Background color="#f9e7e7" gap={20} size={2} />
          {showUIControls && (
            <>
              <Controls className="bg-white border-stone-200 shadow-md rounded-lg overflow-hidden" />
              <MiniMap 
                nodeColor="#292524" 
                maskColor="rgba(250, 250, 249, 0.7)" 
                className="bg-white border border-stone-200 rounded-lg shadow-md"
              />
            </>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}

export function MindmapApp({ onBack }: MindmapAppProps) {
  const [mindmaps, setMindmaps] = useState<MindmapData[]>([]);
  const [selectedMindmap, setSelectedMindmap] = useState<MindmapData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allEntries = await db.getAllEntries();
    const mmaps = allEntries.filter((e: any) => e.notebookId === 'mindmap-app');
    const sorted = mmaps.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setMindmaps(sorted);
  };

  const handleCreateMindmap = async () => {
    const newMindmap: MindmapData = {
      id: crypto.randomUUID(),
      content: 'New Mindmap',
      createdAt: new Date().toISOString(),
      notebookId: 'mindmap-app',
      nodes: initialNodes,
      edges: initialEdges,
    };
    
    await db.saveEntry(newMindmap);
    setMindmaps(prev => [newMindmap, ...prev]);
    setSelectedMindmap(newMindmap);
  };

  const handleSaveMindmap = async (data: MindmapData) => {
    await db.saveEntry(data);
    setMindmaps(prev => prev.map(m => m.id === data.id ? data : m));
  };

  const handleDeleteMindmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this mindmap?')) {
      await db.deleteEntry(id);
      setMindmaps(prev => prev.filter(m => m.id !== id));
    }
  };

  if (selectedMindmap) {
    return (
      <ReactFlowProvider>
        <MindmapEditor 
          mindmap={selectedMindmap} 
          onBack={() => setSelectedMindmap(null)} 
          onSave={handleSaveMindmap}
        />
      </ReactFlowProvider>
    );
  }

  const handleUpdateMindmapCard = async (id: string, updates: Partial<MindmapData>) => {
    const updated = mindmaps.map(m => m.id === id ? { ...m, ...updates } : m);
    setMindmaps(updated);
    const target = updated.find(m => m.id === id);
    if (target) {
      await db.saveEntry(target);
    }
  };

  const filteredMindmaps = mindmaps.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#faf0f0] relative overflow-hidden">
      {/* Header */}
      <div className="relative shrink-0 z-10 bg-gradient-to-br from-[#fff5f7] to-[#ffe4e8] text-stone-800 pt-12 pb-6 px-6 rounded-b-[40px] shadow-md border-b border-white/50">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-stone-700" />
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
            <MapIcon className="w-6 h-6 text-[#ff8fa3]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800">Sweet Mind</h1>
            <p className="text-stone-500 text-sm">{mindmaps.length} maps created</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-6 px-6 pb-4 flex items-center justify-between gap-4 relative z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search mindmaps..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 focus:ring-2 focus:ring-stone-400/20 placeholder-stone-400 text-stone-700 transition-all shadow-sm"
          />
        </div>

        <button 
          onClick={handleCreateMindmap}
          className="p-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white transition-colors shadow-sm"
          title="New Mindmap"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
        {filteredMindmaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <MapIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>No mindmaps found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredMindmaps.map((mm) => (
              <motion.div
                key={mm.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMindmap(mm)}
                className="rounded-2xl p-4 shadow-sm border border-stone-100 cursor-pointer flex flex-col aspect-square relative group overflow-hidden"
                style={{ 
                  backgroundColor: mm.cardColor || 'white',
                  backgroundImage: mm.cardImage ? `url(${mm.cardImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {mm.cardImage && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />}
                
                <div className="flex-1 flex items-center justify-center relative z-10">
                  {!mm.cardImage && <MapIcon className={`w-12 h-12 ${mm.cardColor ? 'text-white/40' : 'text-stone-200'}`} />}
                </div>
                <div className="mt-auto relative z-10">
                  <h3 className={`font-bold text-sm truncate ${mm.cardImage || mm.cardColor ? 'text-white' : 'text-stone-800'}`}>{mm.content}</h3>
                  <p className={`text-[10px] mt-1 ${mm.cardImage || mm.cardColor ? 'text-white/70' : 'text-stone-500'}`}>
                    {new Date(mm.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={(e) => handleDeleteMindmap(mm.id, e)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="p-2 bg-white text-stone-600 rounded-full shadow-lg hover:bg-stone-50 transition-colors"
                      title="Đổi màu"
                    >
                      <Settings2 className="w-3 h-3" />
                    </button>
                    <div className="absolute top-0 right-10 hidden group-hover:flex bg-white p-2 rounded-xl shadow-xl border border-stone-100 gap-1 z-30">
                      {MINDMAP_COLORS.slice(0, 5).map(color => (
                        <button 
                          key={color}
                          onClick={(e) => { e.stopPropagation(); handleUpdateMindmapCard(mm.id, { cardColor: color }); }}
                          className="w-4 h-4 rounded-full border border-stone-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUpdateMindmapCard(mm.id, { cardColor: undefined }); }}
                        className="w-4 h-4 rounded-full border border-stone-200 bg-white flex items-center justify-center text-[8px]"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <ImageUploader 
                    onImageSelect={(url) => handleUpdateMindmapCard(mm.id, { cardImage: url })}
                  >
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white text-stone-600 rounded-full shadow-lg hover:bg-stone-50 transition-colors"
                      title="Đổi ảnh bìa"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </ImageUploader>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

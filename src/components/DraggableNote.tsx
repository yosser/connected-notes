import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import './NotesBoard.css';

interface DraggableNoteProps {
    id: string;
    title: string;
    content: string;
    position: { x: number; y: number };
    collapsed: boolean;
    onCollapseToggle: () => void;
    hasChildren: boolean;
    selected: boolean;
    onSelect: () => void;
}

interface DragItem {
    id: string;
    position: { x: number; y: number };
    mouseOffset: { x: number; y: number };
}

const DraggableNote: React.FC<DraggableNoteProps> = ({
    id,
    title,
    content,
    position,
    collapsed,
    onCollapseToggle,
    hasChildren,
    selected,
    onSelect,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
        type: 'note',
        item: (monitor) => {
            const clientOffset = monitor.getClientOffset();
            const noteRect = ref.current?.getBoundingClientRect();
            if (clientOffset && noteRect) {
                return {
                    id,
                    position,
                    mouseOffset: {
                        x: clientOffset.x - noteRect.left,
                        y: clientOffset.y - noteRect.top
                    }
                };
            }
            return { id, position, mouseOffset: { x: 0, y: 0 } };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    drag(ref);

    return (
        <div
            ref={ref}
            className={`note-container ${selected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                zIndex: isDragging ? 3 : 1,
            }}
        >
            <div
                className="note-header"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                <h3 className="note-title">{title}</h3>
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCollapseToggle();
                        }}
                        className="collapse-button"
                    >
                        {collapsed ? '▶' : '▼'}
                    </button>
                )}
            </div>
            <div className="note-content">
                <p>{content}</p>
            </div>
        </div>
    );
};

export default DraggableNote; 
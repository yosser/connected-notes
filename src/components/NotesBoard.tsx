import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import DraggableNote from './DraggableNote';
import Arrow from './Arrow';
import './NotesBoard.css';

interface Note {
    id: string;
    title: string;
    content: string;
    position: { x: number; y: number };
    children: string[]; // IDs of child notes
    collapsed: boolean; // Whether the note's children are collapsed
    selected: boolean;
}

interface DragItem {
    id: string;
    position: { x: number; y: number };
    mouseOffset: { x: number; y: number };
}

const NotesBoard: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [notes, setNotes] = useState<Record<string, Note>>({
        "1": {
            "id": "1",
            "title": "Project Overview",
            "content": "Main project goals and objectives",
            "position": {
                "x": 44,
                "y": 95
            },
            "children": [
                "2",
                "3",
                "4"
            ],
            "collapsed": false,
            "selected": false
        },
        "2": {
            "id": "2",
            "title": "Research Phase",
            "content": "Initial research and analysis",
            "position": {
                "x": 400.5,
                "y": 37
            },
            "children": [
                "5",
                "6"
            ],
            "collapsed": false,
            "selected": false
        },
        "3": {
            "id": "3",
            "title": "Development",
            "content": "Core development tasks",
            "position": {
                "x": 408.5,
                "y": 237
            },
            "children": [
                "7",
                "8"
            ],
            "collapsed": false,
            "selected": false
        },
        "4": {
            "id": "4",
            "title": "Testing",
            "content": "Quality assurance and testing",
            "position": {
                "x": 402.5,
                "y": 361
            },
            "children": [
                "9"
            ],
            "collapsed": false,
            "selected": false
        },
        "5": {
            "id": "5",
            "title": "Market Analysis",
            "content": "Study of market trends and competitors",
            "position": {
                "x": 776,
                "y": 117
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "6": {
            "id": "6",
            "title": "User Research",
            "content": "Interviews and surveys",
            "position": {
                "x": 1086,
                "y": 30
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "7": {
            "id": "7",
            "title": "Frontend",
            "content": "User interface development",
            "position": {
                "x": 1110,
                "y": 266
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "8": {
            "id": "8",
            "title": "Backend",
            "content": "Server and database development",
            "position": {
                "x": 1111,
                "y": 382
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "9": {
            "id": "9",
            "title": "QA Testing",
            "content": "Quality assurance procedures",
            "position": {
                "x": 767,
                "y": 373
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "note1": {
            "id": "note1",
            "title": "Project Management",
            "content": "Main project overview and goals",
            "position": {
                "x": 48,
                "y": 677
            },
            "children": [
                "note2",
                "note3"
            ],
            "collapsed": false,
            "selected": false
        },
        "note2": {
            "id": "note2",
            "title": "Planning Phase",
            "content": "Initial planning and requirements gathering",
            "position": {
                "x": 334,
                "y": 723
            },
            "children": [
                "note4",
                "note5"
            ],
            "collapsed": false,
            "selected": false
        },
        "note3": {
            "id": "note3",
            "title": "Development Phase",
            "content": "Core development work",
            "position": {
                "x": 441,
                "y": 525
            },
            "children": [
                "note6",
                "note7"
            ],
            "collapsed": false,
            "selected": false
        },
        "note4": {
            "id": "note4",
            "title": "Requirements",
            "content": "Detailed requirements specification",
            "position": {
                "x": 646,
                "y": 653
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "note5": {
            "id": "note5",
            "title": "Timeline",
            "content": "Project schedule and milestones",
            "position": {
                "x": 645,
                "y": 775
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "note6": {
            "id": "note6",
            "title": "Frontend",
            "content": "User interface development",
            "position": {
                "x": 916,
                "y": 588
            },
            "children": [],
            "collapsed": false,
            "selected": false
        },
        "note7": {
            "id": "note7",
            "title": "Backend",
            "content": "Server and database development",
            "position": {
                "x": 908,
                "y": 497
            },
            "children": [],
            "collapsed": false,
            "selected": false
        }
    });

    const [, drop] = useDrop<DragItem, void, unknown>(() => ({
        accept: 'note',
        drop: (item, monitor) => {
            const clientOffset = monitor.getClientOffset();
            const boardRect = ref.current?.getBoundingClientRect();

            if (clientOffset && boardRect) {
                const x = clientOffset.x - boardRect.left - item.mouseOffset.x;
                const y = clientOffset.y - boardRect.top - item.mouseOffset.y;
                handlePositionChange(item.id, { x, y });
            }
        },
    }));

    drop(ref);

    const handlePositionChange = (id: string, position: { x: number; y: number }) => {
        setNotes(currentNotes => ({
            ...currentNotes,
            [id]: {
                ...currentNotes[id],
                position,
            },
        }));
    };

    const handleCollapseToggle = (id: string) => {
        setNotes(currentNotes => ({
            ...currentNotes,
            [id]: {
                ...currentNotes[id],
                collapsed: !currentNotes[id].collapsed,
            },
        }));
    };

    const handleNoteSelect = (noteId: string) => {
        setNotes(prevNotes => {
            const newNotes = { ...prevNotes };
            const toggleSelection = (id: string) => {
                const note = newNotes[id];
                if (note) {
                    note.selected = !note.selected;
                    // Recursively toggle selection for all children
                    note.children.forEach(childId => toggleSelection(childId));
                }
            };
            toggleSelection(noteId);
            return newNotes;
        });
    };

    // Calculate the connection points for the arrows
    const getNoteConnectionPoints = (note: Note, isStart: boolean) => ({
        x: note.position.x + (isStart ? 240 : 10), // 250px width - 10px for end, 10px for start
        y: note.position.y + 10,  // 10px from top
    });

    // Get all visible notes (filtering out collapsed children)
    const getVisibleNotes = () => {
        const visibleNotes: Note[] = [];
        const processedNotes = new Set<string>();

        const processNote = (noteId: string) => {
            // Skip if we've already processed this note
            if (processedNotes.has(noteId)) return;
            processedNotes.add(noteId);

            const note = notes[noteId];
            if (!note) return;

            // Add the note to visible notes
            visibleNotes.push(note);

            // Only process children if the note is not collapsed
            if (!note.collapsed) {
                note.children.forEach(processNote);
            }
        };

        // Start with root notes (notes that are not children of any other note)
        const rootNotes = Object.values(notes).filter(note =>
            !Object.values(notes).some(parent => parent.children.includes(note.id))
        );

        rootNotes.forEach(root => processNote(root.id));
        return visibleNotes;
    };

    // Helper function to check if a note is visible (not collapsed and all ancestors are not collapsed)
    const isNoteVisible = (noteId: string, isArrow: boolean = false): boolean => {
        const note = notes[noteId];
        if (!note) return false;

        // Check if this note is collapsed
        if (note.collapsed && !isArrow) {
            return false;
        }

        // Check if any ancestor is collapsed
        const findParent = (childId: string): Note | undefined => {
            return Object.values(notes).find(parent => parent.children.includes(childId));
        };

        let parent = findParent(noteId);
        while (parent) {
            if (parent.collapsed) return false;
            parent = findParent(parent.id);
        }

        return true;
    };

    // Generate arrow pairs for parent-child relationships
    const getArrowPairs = (visibleNotes: Note[]) => {
        const arrowPairs = visibleNotes.map(note => {
            // Skip if parent is collapsed
            if (note.collapsed) return [];

            // Only include arrows where child is visible
            return note.children
                .filter(childId => {
                    const childNote = notes[childId];
                    return childNote && isNoteVisible(childId, true);
                })
                .map(childId => ({
                    start: getNoteConnectionPoints(note, true),
                    end: getNoteConnectionPoints(notes[childId], false),
                }));
        });
        const p = arrowPairs.flat().filter(pair => pair !== undefined);

        return p;
    }

    const visibleNotes = getVisibleNotes();

    const layoutNotes = () => {
        setNotes(prevNotes => {
            const newNotes = { ...prevNotes };
            const processedNotes = new Set<string>();
            const screenWidth = window.innerWidth;
            const MARGIN = 50;
            const MIN_NODE_SPACING = 300;
            const LEVEL_HEIGHT = 200;

            // Calculate the width of the tree at each level
            const calculateLevelWidths = () => {
                const widths: number[] = [];
                const processLevel = (noteId: string, level = 0) => {
                    const note = newNotes[noteId];
                    if (!note) return;

                    widths[level] = (widths[level] || 0) + 1;
                    if (!note.collapsed) {
                        note.children.forEach(childId => processLevel(childId, level + 1));
                    }
                };

                // Start with root notes
                const rootNotes = Object.values(newNotes).filter(note =>
                    !Object.values(newNotes).some(parent => parent.children.includes(note.id))
                );
                rootNotes.forEach(root => processLevel(root.id));
                return widths;
            };

            // Calculate the maximum width needed for each level
            const levelWidths = calculateLevelWidths();
            const maxWidth = Math.max(...levelWidths);
            const totalWidth = Math.min(screenWidth - (2 * MARGIN), maxWidth * MIN_NODE_SPACING);
            const nodeSpacing = totalWidth / (maxWidth + 1);

            // Layout a single node and its children
            const layoutNode = (noteId: string, level: number, index: number) => {
                if (processedNotes.has(noteId)) return;
                processedNotes.add(noteId);

                const note = newNotes[noteId];
                if (!note) return;

                // Calculate horizontal position
                const levelWidth = levelWidths[level];
                const levelStartX = (screenWidth - (levelWidth * nodeSpacing)) / 2;
                const x = levelStartX + (index * nodeSpacing);

                // Calculate vertical position
                const y = MARGIN + (level * LEVEL_HEIGHT);

                // Update the note's position
                note.position = { x, y };

                // Layout children if not collapsed
                if (!note.collapsed) {
                    note.children.forEach((childId, childIndex) => {
                        layoutNode(childId, level + 1, childIndex);
                    });
                }
            };

            // Start with root notes
            const rootNotes = Object.values(newNotes).filter(note =>
                !Object.values(newNotes).some(parent => parent.children.includes(note.id))
            );

            // Layout each root note and its hierarchy
            rootNotes.forEach((root, index) => {
                layoutNode(root.id, 0, index,);
            });

            return newNotes;
        });
    };

    const arrowPairs = getArrowPairs(visibleNotes);

    return (
        <div ref={ref} className="notes-board">
            <button
                onClick={layoutNotes}
                className="layout-button"
            >
                Layout Notes
            </button>
            {arrowPairs.map((pair, index) => (
                <Arrow
                    key={`arrow-${index}`}
                    start={pair.start}
                    end={pair.end}
                />
            ))}
            {visibleNotes.map(note => (
                <DraggableNote
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    content={note.content}
                    position={note.position}
                    collapsed={note.collapsed}
                    onCollapseToggle={() => handleCollapseToggle(note.id)}
                    hasChildren={note.children.length > 0}
                    selected={note.selected}
                    onSelect={() => handleNoteSelect(note.id)}
                />
            ))}
            <div className="debug-overlay">
                <pre>
                    {JSON.stringify(notes, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default NotesBoard; 
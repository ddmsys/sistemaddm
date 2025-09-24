// src/components/projects/ProjectKanban.tsx
"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Project, ProjectStatus, KanbanColumn } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";

interface ProjectKanbanProps {
  projects: Project[];
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
}

export function ProjectKanban({
  projects,
  onStatusChange,
}: ProjectKanbanProps) {
  const columns: KanbanColumn[] = [
    {
      id: "planejamento",
      title: "Planejamento",
      color: "bg-blue-100 border-blue-300",
      projects: projects.filter((p) => p.status === "planejamento"),
    },
    {
      id: "em_progresso",
      title: "Em Produção",
      color: "bg-yellow-100 border-yellow-300",
      projects: projects.filter((p) => p.status === "em_progresso"),
    },
    {
      id: "concluido",
      title: "Concluído",
      color: "bg-gray-100 border-gray-300",
      projects: projects.filter((p) => p.status === "concluido"),
    },
  ];

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as ProjectStatus;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn(
              "rounded-lg border-2 border-dashed p-4 min-h-[400px]",
              column.color
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <span className="bg-white rounded-full px-2 py-1 text-sm font-medium">
                {column.projects.length}
              </span>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-[300px] space-y-3",
                    snapshot.isDraggingOver && "bg-white/50 rounded-lg"
                  )}
                >
                  {column.projects.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "transition-all duration-200",
                            snapshot.isDragging && "rotate-3 shadow-lg"
                          )}
                        >
                          <ProjectCard project={project} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

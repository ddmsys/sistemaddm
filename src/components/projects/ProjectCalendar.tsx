"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";

interface ProjectCalendarProps {
  projects: Project[];
}

export function ProjectCalendar({ projects }: ProjectCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const projectsForDate = projects.filter((project) =>
    project.dueDate ? isSameDay(project.dueDate, selectedDate) : false
  );

  const getProjectsForDate = (date: Date) => {
    return projects.filter((project) =>
      project.dueDate ? isSameDay(project.dueDate, date) : false
    );
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayProjects = getProjectsForDate(date);
      if (dayProjects.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayProjects = getProjectsForDate(date);
      const hasOverdue = dayProjects.some(
        (p) => p.dueDate && p.dueDate < new Date() && p.status !== "concluido"
      );

      if (hasOverdue) return "text-red-600 font-bold";
      if (dayProjects.length > 0) return "font-semibold";
    }
    return "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Prazos</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              onChange={(date) => setSelectedDate(date as Date)}
              value={selectedDate}
              locale="pt-BR"
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="w-full border-none"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              Projetos para{" "}
              {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsForDate.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum projeto para esta data
              </p>
            ) : (
              <div className="space-y-3">
                {projectsForDate.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{project.title}</h4>
                      <Badge
                        variant={
                          project.status === "concluido"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {project.clientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {project.catalogCode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

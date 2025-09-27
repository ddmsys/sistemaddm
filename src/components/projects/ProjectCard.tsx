// src/components/projects/ProjectCard.tsx
import { Project, ClientApprovalTask } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isOverdue =
    project.dueDate < new Date() && project.status !== "concluido";
  const pendingApprovals = (project.clientApprovalTasks ?? []).filter(
    (task: ClientApprovalTask) => task.status === "pending"
  ).length;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {project.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {project.catalogCode}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="truncate">{project.clientName}</span>
        </div>

        <div
          className={cn(
            "flex items-center text-sm",
            isOverdue ? "text-red-600" : "text-gray-600"
          )}
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(project.dueDate, "dd/MM/yyyy", { locale: ptBR })}</span>
          {isOverdue && <AlertCircle className="w-4 h-4 ml-1" />}
        </div>

        {(project.proofsCount ?? 0) > 0 && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{project.proofsCount} prova(s)</span>
          </div>
        )}

        {pendingApprovals > 0 && (
          <Badge variant="destructive" className="text-xs">
            {pendingApprovals} aprovação(ões) pendente(s)
          </Badge>
        )}

        {project.budget && (
          <div className="text-sm font-medium text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(project.budget)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

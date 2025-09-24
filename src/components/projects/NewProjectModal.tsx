"use client";

import ProjectForm from "@/app/auth/projects/ProjectForm";

interface NewProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function NewProjectModal({ onClose, onCreated }: NewProjectModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <ProjectForm
          onSave={() => {
            onCreated();
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

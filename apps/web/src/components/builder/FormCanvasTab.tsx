import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FormField } from "@sec-form/validators";
import { Card } from "@/components/ui/card";
import { SortableFieldItem } from "./SortableFieldItem";
import { useTranslations } from "next-intl";

interface FormCanvasTabProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  fields: FormField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleDeleteField: (id: string) => void;
  saveForm: (fields: FormField[]) => void;
  handleReorder: (index: number, direction: "up" | "down") => void;
  handleDragReorder?: (oldIndex: number, newIndex: number) => void;
}

export function FormCanvasTab({
  title,
  setTitle,
  description,
  setDescription,
  fields,
  selectedFieldId,
  setSelectedFieldId,
  handleUpdateField,
  handleDeleteField,
  saveForm,
  handleReorder,
  handleDragReorder,
}: FormCanvasTabProps) {
  const t = useTranslations("Builder");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (handleDragReorder) {
        handleDragReorder(oldIndex, newIndex);
      } else {
        // Fallback or use standard logic if not provided
        if (oldIndex < newIndex) {
          for (let i = oldIndex; i < newIndex; i++) handleReorder(i, "down");
        } else {
          for (let i = oldIndex; i > newIndex; i--) handleReorder(i, "up");
        }
      }
    }
  }

  return (
    <Card className="border-border rounded-3xl bg-card/20 backdrop-blur-[1px] p-6 shadow-sm flex flex-col gap-5 relative">
      <div className="">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            saveForm(fields);
          }}
          className="w-full text-2xl font-bold font-outfit border-none focus:outline-none bg-transparent text-foreground border-b border-transparent focus:border-border pb-1 transition-colors"
          placeholder={t("canvasTitlePlaceholder")}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            saveForm(fields);
          }}
          className="w-full text-sm text-muted-foreground border-none focus:outline-none bg-transparent border-b border-transparent focus:border-border mt-2 pb-1 transition-colors"
          placeholder={t("canvasDescPlaceholder")}
        />
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        {fields.length === 0 ? (
          <div className="py-16 border border-dashed border-border rounded-2xl text-center text-muted-foreground text-sm">
            {t("canvasEmptyDesc")}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field, index) => (
                <SortableFieldItem 
                  key={field.id}
                  field={field}
                  index={index}
                  selectedFieldId={selectedFieldId}
                  setSelectedFieldId={setSelectedFieldId}
                  handleUpdateField={handleUpdateField}
                  handleDeleteField={handleDeleteField}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </Card>
  );
}

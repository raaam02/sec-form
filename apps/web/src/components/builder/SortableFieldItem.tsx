import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@sec-form/validators";
import { ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SortableFieldItem({
  field, selectedFieldId, setSelectedFieldId, handleUpdateField, handleDeleteField
}: {
  field: FormField;
  index: number;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleDeleteField: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedFieldId(field.id)}
      className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex gap-3 items-center ${
        selectedFieldId === field.id
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card/40 hover:border-border/80"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab opacity-50 hover:opacity-100 shrink-0 outline-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="min-w-0 flex-1">
          {field.type === "step_break" ? (
            <div className="font-semibold text-muted-foreground italic flex flex-col items-center justify-center py-2 mt-2 w-full border border-dashed border-border/50 bg-background/50 rounded-lg">
              <span>--- Page Break ---</span>
              <span className="text-[10px] font-normal mt-1 opacity-70 text-center max-w-[200px]">Fields below this will appear on the next page in the live form</span>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                {field.type} {field.required && <span className="text-destructive">*</span>}
              </span>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-foreground mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                placeholder="Field Label"
              />
              {selectedFieldId === field.id && (
                <input
                  type="text"
                  value={field.description || ""}
                  onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground text-xs mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                  placeholder="Field description (optional)"
                />
              )}
            </>
          )}
          {/* Card Field Input Template Previews (Only if selected/expanded) */}
          {selectedFieldId === field.id && field.type !== "step_break" && (
            <div className="mt-3">
              {["text", "email", "date"].includes(field.type) && (
                <Input type="text" className="h-9 w-full max-w-sm rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder={field.placeholder || "Response goes here..."} disabled />
              )}
              {field.type === "time" && (
                <Input type="time" className="h-9 w-32 rounded-lg border border-border bg-background/40 px-3 text-xs" disabled />
              )}
              {field.type === "textarea" && (
                <textarea className="w-full max-w-md h-16 rounded-lg border border-border bg-background/40 p-2 text-xs focus:outline-none focus:ring-0" placeholder={field.placeholder || "Write long response..."} disabled />
              )}
              {field.type === "number" && (
                <Input type="number" className="h-9 w-28 rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder="0" disabled />
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center gap-2"><input type="checkbox" className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0" disabled /><span className="text-xs text-muted-foreground">Agree to terms</span></div>
              )}
              {field.type === "rating" && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xl text-muted-foreground select-none">★</span>
                  ))}
                </div>
              )}
              {["select", "multiselect"].includes(field.type) && field.options && (
                <div className="flex flex-wrap gap-1">
                  {field.options.map((opt) => (
                    <span key={opt} className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground border border-border/40">
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Advanced Options & Required Switch (Only if selected) */}
          {selectedFieldId === field.id && field.type !== "step_break" && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Required Field</span>
                <Switch 
                  checked={field.required}
                  onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked })}
                />
              </div>

              {/* Placeholder Field */}
                {["text", "textarea", "email", "phone", "number", "select", "date", "time"].includes(field.type) && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Placeholder</span>
                    <Input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                      className="h-8 text-xs bg-card"
                      placeholder="Enter placeholder text"
                    />
                  </div>
                )}

                {/* Min / Max Validation */}
                {["number", "rating"].includes(field.type) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Minimum Value</span>
                      <Input
                        type="number"
                        value={field.validation?.min !== undefined ? field.validation.min : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : Number(e.target.value);
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              min: val
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maximum Value</span>
                      <Input
                        type="number"
                        value={field.validation?.max !== undefined ? field.validation.max : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : Number(e.target.value);
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              max: val
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>
                )}

                {/* Custom Pattern Regex Validation */}
                {["text", "textarea", "phone"].includes(field.type) && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Regex Validation Pattern</span>
                      <Input
                        type="text"
                        value={field.validation?.pattern || ""}
                        onChange={(e) => {
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              pattern: e.target.value || undefined
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. ^[0-9]{5}$"
                      />
                    </div>
                    {field.validation?.pattern && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custom Error Message</span>
                        <Input
                          type="text"
                          value={field.validation?.errorMessage || ""}
                          onChange={(e) => {
                            handleUpdateField(field.id, {
                              validation: {
                                ...(field.validation || {}),
                                errorMessage: e.target.value || undefined
                              }
                            });
                          }}
                          className="h-8 text-xs bg-card"
                          placeholder="Custom error if pattern fails"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Options list for select, multiselect */}
                {["select", "multiselect"].includes(field.type) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Options</span>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="h-6 px-2 text-[10px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentOptions = field.options || [];
                          handleUpdateField(field.id, { options: [...currentOptions, `Option ${currentOptions.length + 1}`] });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Option
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {(field.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input 
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(field.options || [])];
                              newOptions[optIndex] = e.target.value;
                              handleUpdateField(field.id, { options: newOptions });
                            }}
                            className="h-7 text-xs bg-card"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newOptions = [...(field.options || [])];
                              newOptions.splice(optIndex, 1);
                              handleUpdateField(field.id, { options: newOptions });
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* Actions (Delete and Collapse/Expand) */}
        <div className="flex items-center gap-1 shrink-0 flex-row-reverse">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedFieldId === field.id) {
                setSelectedFieldId(null);
              } else {
                setSelectedFieldId(field.id);
              }
            }}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
          >
            <ChevronUp className={cn("h-4 w-4 transition-all duration-200", selectedFieldId === field.id ? "" : "rotate-180")} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                handleDeleteField(field.id);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField } from "@sec-form/validators";

interface BuilderCanvasActionBarProps {
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  fields: FormField[];
  saveForm: (fields: FormField[], theme?: any, layout?: "standard" | "single_field" | "custom_steps") => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function BuilderCanvasActionBar({
  layoutMode,
  setLayoutMode,
  fields,
  saveForm,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
}: BuilderCanvasActionBarProps) {
  return (
    <div className="absolute w-full top-0 flex items-center justify-between px-1 py-0.5 bg-transparent z-20 shrink-0">
      {/* Left: Layout Select */}
      <div>
        {setLayoutMode ? (
          <div className="w-40">
            <Select value={layoutMode} onValueChange={(val: any) => {
              setLayoutMode(val);
              saveForm(fields, null, val);
            }}>
              <SelectTrigger className="h-8 text-xs focus:ring-1 focus:ring-ring focus:ring-offset-0 bg-card/80 backdrop-blur-sm border-border shadow-sm hover:bg-muted/40 transition-colors">
                <SelectValue placeholder="Display Layout">
                  {layoutMode === "standard" ? "Standard (All Fields)" :
                   layoutMode === "single_field" ? "One Field per Step" :
                   layoutMode === "custom_steps" ? "Grouped by Steps" :
                   undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Standard (All Fields)</span>
                    <span className="text-[10px] text-muted-foreground">All fields shown on one page</span>
                  </div>
                </SelectItem>
                <SelectItem value="single_field" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">One Field per Step</span>
                    <span className="text-[10px] text-muted-foreground">Show one question at a time</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom_steps" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Grouped by Steps</span>
                    <span className="text-[10px] text-muted-foreground">Use page break elements to group</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : <div />}
      </div>

      {/* Right: Undo/Redo */}
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm border border-border shadow-sm rounded-full p-0.5">
         <Tooltip delayDuration={0}>
           <TooltipTrigger asChild>
             <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} className="h-6 w-7 rounded-full">
               <Undo2 className="h-3.5 w-3.5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="bottom">Undo [Ctrl+Z]</TooltipContent>
         </Tooltip>
         <div className="w-[1px] h-3 bg-border" />
         <Tooltip delayDuration={0}>
           <TooltipTrigger asChild>
             <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} className="h-6 w-7 rounded-full">
               <Redo2 className="h-3.5 w-3.5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="bottom">Redo [Ctrl+Y]</TooltipContent>
         </Tooltip>
      </div>
    </div>
  );
}

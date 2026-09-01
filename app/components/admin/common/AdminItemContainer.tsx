"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

const AdminItemContainer = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const childArray = React.Children.toArray(children);
  const [header, ...content] = childArray;

  return (
    <div className="flex flex-col bg-white rounded-[10px] shadow-lg overflow-hidden border border-secondary">
      <div className="flex items-center justify-between pr-5">
        <div className="flex-1">{header}</div>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-1 text-primary cursor-pointer hover:scale-120 transition-all duration-500 ease-in-out"
        >
          {isExpanded ? (
            <Minimize2 size={16} className="-rotate-45" />
          ) : (
            <Maximize2 size={16} className="-rotate-45" />
          )}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows, border-t] duration-500 ease-in-out ${isExpanded ? "border-t border-secondary" : "border-t-0"}`}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminItemContainer;

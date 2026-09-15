"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface AdminItemContainerProps {
  children: React.ReactNode;
  expansion?: boolean;
}

const AdminItemContainer = ({
  children,
  expansion = true,
}: AdminItemContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const childArray = React.Children.toArray(children);
  const [header, ...content] = childArray;

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-secondary/60">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">{header}</div>

        {expansion && (
          <button
            type="button"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mr-4 p-1.5 rounded-full text-description-color cursor-pointer hover:text-primary hover:bg-cream-background hover:scale-110 transition-all duration-300 ease-in-out"
          >
            {isExpanded ? (
              <Minimize2 size={15} className="-rotate-45" />
            ) : (
              <Maximize2 size={15} className="-rotate-45" />
            )}
          </button>
        )}
      </div>

      {expansion ? (
        <div
          className={`grid transition-[grid-template-rows,border-top] duration-500 ease-in-out ${
            isExpanded
              ? "border-t border-secondary/60"
              : "border-t-0"
          }`}
          style={{
            gridTemplateRows: isExpanded ? "1fr" : "0fr",
          }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2">{content}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">{content}</div>
      )}
    </div>
  );
};

export default AdminItemContainer;
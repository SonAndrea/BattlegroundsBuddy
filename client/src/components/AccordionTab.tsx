import "./AccordionTab.css";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX } from "react";

interface AccoridionTabProps {
  title: string;
  content: JSX.Element;
  isExpanded: boolean;
  onToggle: () => void;
}

function AccordionTab({
  title,
  content,
  isExpanded,
  onToggle,
}: AccoridionTabProps) {
  return (
    <div className="container">
      <div className="container-header" onClick={onToggle}>
        <h3>{title}</h3>
        <img
          src="../src/assets/arrow.png"
          className={`arrow-icon ${isExpanded ? "rotated" : ""}`}
        />
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="accordion-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="content-inner">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionTab;

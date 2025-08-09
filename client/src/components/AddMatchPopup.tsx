import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import "./AddMatchPopup.css";

const ALL_TAGS = [
  "Beasts",
  "Undead",
  "Menagerie",
  "Quilboar",
  "Dragons",
  "Demons",
  "Mechs",
  "Nagas",
  "Pirates",
  "Murlocs",
  "No-Type",
  "Elementals",
];

interface AddMatchFormProps {
  hero: string;
  placement: number;
  mmr: number;
  comp: string[];
  setHero: (hero: string) => void;
  setPlacement: (placement: number) => void;
  setMMR: (mmr: number) => void;
  setComp: (comp: string[]) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

function AddMatchForm({
  hero,
  placement,
  mmr,
  comp,
  setHero,
  setPlacement,
  setMMR,
  setComp,
  onSubmit,
  onClose,
}: AddMatchFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [formError, setFormError] = useState("");

  const filteredSuggestions = useMemo(() => {
    return ALL_TAGS.filter(
      (tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !comp.includes(tag)
    );
  }, [inputValue, comp]);

  const handleAddTag = (tag: string) => {
    if (!comp.includes(tag)) {
      setComp([...comp, tag]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setComp(comp.filter((t) => t !== tag));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submit
      if (filteredSuggestions.length > 0) {
        handleAddTag(filteredSuggestions[0]);
      }
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (comp.length === 0) {
      setFormError("Please select at least one tag for the composition.");
      return;
    }
    setFormError("");
    onSubmit(e);
  };

  return (
    <div className="popup-border">
      <div className="popup-background"></div>
      <div className="popup-content">
        <div className="popup-header">
          <h1>Add Match</h1>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="input-container">
            <h2>Hero</h2>
            <input
              type="text"
              value={hero}
              onChange={(e) => setHero(e.target.value)}
              required
              placeholder="Enter hero name..."
            />
          </div>

          <div className="input-container">
            <h2>Placement</h2>
            <input
              type="number"
              value={placement}
              onChange={(e) => setPlacement(Number(e.target.value))}
              required
            />
          </div>

          <div className="input-container">
            <h2>Current MMR</h2>
            <input
              type="number"
              value={mmr}
              onChange={(e) => setMMR(Number(e.target.value))}
              required
            />
          </div>

          <div className="input-container">
            <h2>Composition</h2>
            <div className="tag-input-container">
              <div className="selected-tags">
                {comp.map((tag) => (
                  <div className="tag-bubble" key={tag}>
                    {tag}
                    <button
                      type="button"
                      className="remove-tag-button"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type to add tags..."
              />
              {inputValue && filteredSuggestions.length > 0 && (
                <ul className="suggestion-list">
                  {filteredSuggestions.map((tag) => (
                    <li
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="suggestion-item"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {formError && <div className="form-error">{formError}</div>}
          </div>
          <div className="submission-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMatchForm;

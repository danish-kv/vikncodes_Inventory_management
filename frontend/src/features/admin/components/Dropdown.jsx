import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Wrap children with click handlers
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: (e) => {
          // Call the original onClick if it exists
          if (child.props.onClick) {
            child.props.onClick(e);
          }
          // Close the dropdown
          setIsOpen(false);
        },
      });
    }
    return child;
  });

  return (
    <div className="relative " ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          {wrappedChildren}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

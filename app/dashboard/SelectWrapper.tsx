// @ts-nocheck
import React, { useState } from "react";

export default function SelectWrapper({ children, onSelectedValueChange }) {
    const [selectedValue, setSelectedValue] = useState("");

    const handleSelectChange = (value) => {
    setSelectedValue(value);
       if (typeof onSelectedValueChange === "function") {
           onSelectedValueChange(value);
    }
  };

   return children({ selectedValue, handleSelectChange });
}

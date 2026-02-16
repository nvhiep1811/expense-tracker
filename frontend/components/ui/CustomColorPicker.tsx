"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { isValidHexColor, getContrastColor } from "@/constants/colors";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export default function CustomColorPicker({
  value,
  onChange,
  onClose,
}: CustomColorPickerProps) {
  const [tempColor, setTempColor] = useState(value);
  const [error, setError] = useState("");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value.toUpperCase();
    setTempColor(newColor);
    setError("");
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.trim();
    // Auto-add # if missing
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    hex = hex.toUpperCase();
    setTempColor(hex);

    if (isValidHexColor(hex)) {
      setError("");
    } else {
      setError("Mã màu không hợp lệ");
    }
  };

  const handleApply = () => {
    if (isValidHexColor(tempColor)) {
      onChange(tempColor);
      onClose();
    } else {
      setError("Vui lòng nhập mã màu hex hợp lệ");
    }
  };

  const textColor = getContrastColor(tempColor);

  return (
    <div className="mt-3 p-4 bg-hover-bg rounded-xl border border-card-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-text" />
          <span className="text-sm font-medium text-foreground">
            Màu tùy chỉnh
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted-text hover:text-foreground"
        >
          Đóng
        </button>
      </div>

      <div className="flex gap-3">
        {/* HTML5 Color Picker */}
        <div className="relative">
          <input
            type="color"
            value={tempColor}
            onChange={handleColorChange}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-card-border"
            title="Chọn màu"
          />
        </div>

        {/* Preview & Hex Input */}
        <div className="flex-1 space-y-2">
          <div
            className="h-16 rounded-lg flex items-center justify-center font-mono text-sm font-semibold shadow-sm"
            style={{
              backgroundColor: tempColor,
              color: textColor,
            }}
          >
            {tempColor}
          </div>
        </div>
      </div>

      {/* Manual Hex Input */}
      <div>
        <label className="block text-xs text-muted-text mb-1">
          Mã hex (ví dụ: #FF5733)
        </label>
        <input
          type="text"
          value={tempColor}
          onChange={handleHexInput}
          placeholder="#FF5733"
          className={`w-full px-3 py-2 text-sm border ${
            error ? "border-red-500" : "border-input-border"
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground font-mono`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        disabled={!!error || !isValidHexColor(tempColor)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
      >
        <Check className="w-4 h-4" />
        Áp dụng màu này
      </button>
    </div>
  );
}

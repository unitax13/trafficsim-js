import { useRef } from "react";
import FieldType from "../enums/FieldType";
import { Button } from "@mui/material";
import PaintBrush from "../icons/PaintBrush";

interface BrushSectionProps {
  onFieldChosen: (fieldType: FieldType) => void;
}

const BrushSection: React.FC<BrushSectionProps> = ({ onFieldChosen }) => {
  const fieldTypeChosen = useRef<FieldType>(FieldType.Road1);

  const handleFieldChosen = (fieldType: FieldType) => {
    fieldTypeChosen.current = fieldType;
    onFieldChosen(fieldType);
  };

  return (
    <div>
      <Button
        fullWidth
        startIcon={<PaintBrush className="w-6 h-6" />}
        className="bg-slate-800 hover:bg-slate-900"
        variant="contained"
        onClick={() => handleFieldChosen(FieldType.Road1)}
      >
        Road
      </Button>
      <Button
        fullWidth
        startIcon={<PaintBrush className="w-6 h-6" />}
        className="bg-lime-600 hover:bg-lime-700"
        variant="contained"
        onClick={() => handleFieldChosen(FieldType.Urban)}
      >
        Urban area
      </Button>
      <Button
        fullWidth
        startIcon={<PaintBrush className="w-6 h-6" />}
        variant="contained"
        className="bg-yellow-600 hover:bg-yellow-700"
        onClick={() => handleFieldChosen(FieldType.Industrial)}
      >
        Industry area
      </Button>
    </div>
  );
};

export default BrushSection;

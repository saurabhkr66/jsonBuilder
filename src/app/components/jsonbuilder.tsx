"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";

// Define the allowed types
type FieldType = "string" | "number" | "boolean" | "null" | "array" | "object" | "nested";

// Define the field interface
interface FieldTypeSchema {
  id: number;
  key: string;
  type: FieldType;
  children?: FieldTypeSchema[];
}

let idCounter = 0;

function createField(): FieldTypeSchema {
  return {
    id: idCounter++,
    key: "",
    type: "string",
    children: [],
  };
}

function buildJson(fields: FieldTypeSchema[]): unknown {
  const json: Record<string, unknown> = {};
  fields.forEach((field) => {
    if (!field.key) return;
    switch (field.type) {
      case "nested":
        json[field.key] = buildJson(field.children || []);
        break;
      case "string":
        json[field.key] = "";
        break;
      case "number":
        json[field.key] = 0;
        break;
      case "boolean":
        json[field.key] = false;
        break;
      case "null":
        json[field.key] = null;
        break;
      case "array":
        json[field.key] = [];
        break;
      case "object":
        json[field.key] = {};
        break;
    }
  });
  return json;
}

interface FieldProps {
  field: FieldTypeSchema;
  onChange: (updated: FieldTypeSchema) => void;
  onDelete: () => void;
}

function Field({ field, onChange, onDelete }: FieldProps) {
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onChange({ ...field, type: value as FieldType });
  };

  const handleAddNested = () => {
    onChange({ ...field, type: "nested", children: [createField()] });
  };

  const handleChildChange = (child: FieldTypeSchema, index: number) => {
    const newChildren = [...(field.children || [])];
    newChildren[index] = child;
    onChange({ ...field, children: newChildren });
  };

  const handleAddChild = () => {
    onChange({ ...field, children: [...(field.children || []), createField()] });
  };

  const handleDeleteChild = (index: number) => {
    const newChildren = (field.children || []).filter((_, i) => i !== index);
    onChange({ ...field, children: newChildren });
  };

  return (
    <Card className="p-4 mb-2 space-y-2">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          value={field.key}
          onChange={handleKeyChange}
          placeholder="Key name"
          className="w-[200px]"
        />
        <Select value={field.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="null">Null</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="object">Object</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleAddNested}>
          Make Nested
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash />
        </Button>
      </div>

      {field.type === "nested" && (
        <div className="ml-6 border-l pl-4 space-y-2">
          {(field.children || []).map((child, index) => (
            <Field
              key={child.id}
              field={child}
              onChange={(updated) => handleChildChange(updated, index)}
              onDelete={() => handleDeleteChild(index)}
            />
          ))}
          <Button onClick={handleAddChild} size="sm">
            Add Nested Field
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function JsonSchemaBuilder() {
  const [fields, setFields] = useState<FieldTypeSchema[]>([createField()]);

  const handleFieldChange = (field: FieldTypeSchema, index: number) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, createField()]);
  };

  const handleDeleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const generatedJson = buildJson(fields);

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto mt-10">
      <div className="flex-1 space-y-4">
        {fields.map((field, index) => (
          <Field
            key={field.id}
            field={field}
            onChange={(updated) => handleFieldChange(updated, index)}
            onDelete={() => handleDeleteField(index)}
          />
        ))}
        <Button onClick={handleAddField}>Add Field</Button>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-2">JSON Preview</h2>
        <pre className="text-sm">{JSON.stringify(generatedJson, null, 2)}</pre>
      </div>
    </div>
  );
}

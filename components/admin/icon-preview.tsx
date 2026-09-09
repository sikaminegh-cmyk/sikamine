import { DynamicIcon } from "@/lib/icon-registry";

export function IconPreview({ name, size = 18 }: { name: string; size?: number }) {
  return <DynamicIcon name={name} size={size} />;
}

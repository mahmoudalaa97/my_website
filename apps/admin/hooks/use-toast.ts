import { toast } from "@/components/ui/toaster";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: (props: ToastProps) => toast(props),
  };
}


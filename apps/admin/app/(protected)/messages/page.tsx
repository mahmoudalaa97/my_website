"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { Loader2, Mail, MailOpen, Archive, Trash2, ExternalLink, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const { canManageMessages } = usePermissions();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", showArchived],
    queryFn: () => api.getMessages(showArchived),
  });

  const { data: stats } = useQuery({
    queryKey: ["messageStats"],
    queryFn: () => api.getMessageStats(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.markMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messageStats"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => api.archiveMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messageStats"] });
      toast({ title: "Success", description: "Message archived" });
      setSelectedMessage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messageStats"] });
      toast({ title: "Success", description: "Message deleted" });
      setSelectedMessage(null);
    },
  });

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markReadMutation.mutate(message.id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {!canManageMessages && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <Eye className="h-5 w-5" />
              <span>You have view-only access to messages. Contact an admin to archive or delete messages.</span>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={!showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(false)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Inbox ({stats?.data?.total ? stats.data.total - stats.data.archived : 0})
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(true)}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archived ({stats?.data?.archived || 0})
          </Button>
        </div>
        {stats?.data?.unread ? (
          <span className="text-sm text-muted-foreground">
            {stats.data.unread} unread
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {messages?.data?.map((message: any) => (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent",
                      selectedMessage?.id === message.id && "bg-accent",
                      !message.isRead && "border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {message.isRead ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                        <span className={cn("font-medium", !message.isRead && "text-primary")}>
                          {message.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{message.email}</p>
                    <p className="text-sm line-clamp-1 mt-1">{message.message}</p>
                  </button>
                ))}
                {messages?.data?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No messages found
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">From</Label>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedMessage.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {selectedMessage.projectType && (
                  <div>
                    <Label className="text-muted-foreground">Project Type</Label>
                    <p>{selectedMessage.projectType}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p>{formatDate(selectedMessage.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  {canManageMessages && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => archiveMutation.mutate(selectedMessage.id)}
                        disabled={archiveMutation.isPending || selectedMessage.isArchived}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        {selectedMessage.isArchived ? "Archived" : "Archive"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => deleteMutation.mutate(selectedMessage.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Delete
                      </Button>
                    </>
                  )}
                  <Button asChild>
                    <a href={`mailto:${selectedMessage.email}`}>
                      Reply
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Select a message to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium mb-1", className)}>{children}</p>;
}


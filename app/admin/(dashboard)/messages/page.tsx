import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Contact Messages" description="Enquiries submitted through the public contact form." />
      <MessagesInbox initialMessages={messages ?? []} />
    </div>
  );
}

import Navbar from "@/components/Navbar";

const conversations = [
  {
    name: "BuildRight Construction",
    avatar: "BR",
    lastMessage: "The countertop materials arrived today. We'll start installation tomorrow morning.",
    time: "2 min ago",
    unread: 3,
  },
  {
    name: "Modern Home Solutions",
    avatar: "MH",
    lastMessage: "I've uploaded the revised floor plan to the project files. Please review when you get a chance.",
    time: "1 hr ago",
    unread: 1,
  },
  {
    name: "Artisan Renovators",
    avatar: "AR",
    lastMessage: "Great choice on the oak flooring! It's going to look amazing.",
    time: "3 hrs ago",
    unread: 0,
  },
  {
    name: "Precision Builders Co.",
    avatar: "PB",
    lastMessage: "Project completed! Please leave a review when you have a moment.",
    time: "Yesterday",
    unread: 0,
  },
  {
    name: "HomeRevive Support",
    avatar: "HR",
    lastMessage: "Welcome to HomeRevive! Let us know if you need help getting started.",
    time: "2 days ago",
    unread: 0,
  },
];

export default function MessagesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-card py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <h1 className="text-[32px] md:text-[48px] font-medium leading-tight mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground text-lg">
              Communicate with your contractors and the HomeRevive team.
            </p>
          </div>
        </section>

        {/* Messages List */}
        <section className="py-16">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="bg-card rounded-[var(--radius)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-border">
              {conversations.map((convo) => (
                <div
                  key={convo.name}
                  className="flex items-start gap-4 p-5 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold text-sm">{convo.avatar}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`text-sm truncate ${convo.unread > 0 ? "font-semibold" : "font-medium"}`}>
                        {convo.name}
                      </h3>
                      <span className="text-[12px] text-muted-foreground whitespace-nowrap">{convo.time}</span>
                    </div>
                    <p className={`text-[13px] truncate ${convo.unread > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                      {convo.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {convo.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center shrink-0 mt-1">
                      {convo.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

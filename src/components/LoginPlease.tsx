

export function LoginPlease() {
    return (
        <section className="rounded-[1.45rem] border border-(--line) bg-[radial-gradient(circle_at_86%_22%,rgba(221,107,32,0.16)_0,transparent_39%),linear-gradient(130deg,var(--surface)_0%,#fff8e8_100%)] p-[clamp(1.2rem,3vw,2.2rem)] shadow-[0_18px_40px_rgba(145,95,36,0.11)] max-sm:rounded-[1.05rem]">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="motion-safe:delay-75 motion-safe:transition motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:starting:translate-y-2 motion-safe:starting:scale-[0.99] motion-safe:starting:opacity-0">
                    <h1 className="m-0 font-(--font-display) text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-[#2f2518]">
                        Login to Create a Joke!
                    </h1>
                </div>
            </div>
        </section>
    );
}

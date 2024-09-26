const lenis = new Lenis();
lenis.on("scroll", (e) => {
    console.log(e);
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
function heroAnimation(target) {
    return gsap
        .timeline({
            scrollTrigger: {
                trigger: target,
                start: "top 20%",
                end: "bottom top",
                scrub: 2,
                markers: false,
            },
        })
        .to(target, {
            x: 400,
            opacity: 0,
            duration: 1,
        });
}
heroAnimation(".hero");
heroAnimation(".arrow");

function fadeTechStack(target, direction = "in") {
    return gsap
        .timeline({
            scrollTrigger: {
                trigger: target,
                start: direction === "in" ? "top bottom" : "top 10%",
                end: direction === "in" ? "bottom 90%" : "bottom top",
                scrub: 2,
                markers: false,
            },
        })
        .fromTo(
            target,
            { x: direction === "in" ? -500 : 0, opacity: direction === "in" ? 0 : 1 },
            { x: direction === "in" ? 0 : 500, opacity: direction === "in" ? 1 : 0, duration: 1 }
        );
}
[".node-express", ".passport", ".postgre", ".prisma", ".tailwind", ".gsap"].forEach((target) => {
    fadeTechStack(target, "in");
    fadeTechStack(target, "out");
});

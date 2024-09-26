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
                scrub: true,
                markers: true,
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

function techStackAnimation(target) {
    return gsap
        .timeline({
            scrollTrigger: {
                trigger: target,
                start: "top 20%",
                end: "bottom top",
                scrub: true,
                markers: true,
            },
        })
        .to(target, {
            x: 400,
            opacity: 0,
            duration: 1,
        });
}

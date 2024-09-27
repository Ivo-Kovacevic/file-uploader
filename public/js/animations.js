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

// function heroAnimation(target, trigger) {
//     return gsap.to(target, {
//         x: 400,
//         opacity: 0,
//         scrollTrigger: {
//             trigger: trigger,
//             start: "top 20%",
//             end: "bottom top",
//             scrub: true,
//             markers: false,
//         },
//     });
// }
// heroAnimation(".hero", ".hero-trigger");
// heroAnimation(".arrow", ".arrow-trigger");

function fadeInTechStack(target, trigger) {
    return gsap.from(target, {
        x: -400,
        opacity: 0,
        scrollTrigger: {
            trigger: trigger,
            start: "top bottom",
            end: "bottom 90%",
            scrub: false,
            markers: false,
        },
    });
}
fadeInTechStack(".node-express", ".node-express-trigger");
fadeInTechStack(".passport", ".passport-trigger");
fadeInTechStack(".supabase", ".supabase-trigger");
fadeInTechStack(".postgre", ".postgre-trigger");
fadeInTechStack(".prisma", ".prisma-trigger");
fadeInTechStack(".tailwind", ".tailwind-trigger");
fadeInTechStack(".gsap", ".gsap-trigger");

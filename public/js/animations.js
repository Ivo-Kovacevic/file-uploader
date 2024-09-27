// Lenis
const lenis = new Lenis({
    smooth: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
document.querySelectorAll('a[href^="#"]').forEach((el) => {
    el.addEventListener("click", (e) => {
        e.preventDefault();
        const id = el.getAttribute("href")?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (target) {
            // Update the URL without jumping
            history.pushState(null, "", `#${id}`);
            // Scroll to the target using Lenis
            lenis.scrollTo(target.offsetTop, {
                duration: 1.2,
                easing: (t) => t * (2 - t),
            });
        }
    });
});

// GSAP
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
            start: "top 90%",
            end: "bottom 50%",
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

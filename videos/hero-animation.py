from manim import *

config.background_color = &quot;#0D0D0D&quot;

class HeroScene(Scene):
    def construct(self):
        # Constants
        BLUE = &quot;#00A8E0&quot;
        TEAL = &quot;#00D4AA&quot;
        WHITE = &quot;#FFFFFF&quot;
        MONO = &quot;Menlo&quot;

        # Flowing energy lines
        lines = VGroup()
        for i in range(5):
            line = Line(start=LEFT*4 + DOWN*2 + i*RIGHT*0.5, end=RIGHT*4 + UP*2 + i*UP*0.3, color=BLUE, stroke_width=4)
            lines.add(line)

        self.play(LaggedStart(*[Create(line, run_time=1.5, rate_func=there_and_back) for line in lines], lag_ratio=0.2))
        self.wait(1)

        # Geometric EV shapes (abstract)
        circle = Circle(radius=1.5, color=TEAL, stroke_width=6, fill_opacity=0.3)
        square = Square(side_length=2, color=BLUE, stroke_width=5, fill_opacity=0.2)
        triangle = Triangle(color=WHITE, stroke_width=4, fill_opacity=0.1)

        group = VGroup(circle, square, triangle).arrange(RIGHT, buff=1)

        self.play(FadeIn(group, scale=0.5))
        self.play(
            Rotate(circle, angle=TAU, run_time=4, rate_func=linear),
            Rotate(square, angle=TAU/2, run_time=4, rate_func=linear),
            Rotate(triangle, angle=TAU*1.5, run_time=4, rate_func=linear)
        )
        self.wait(2)

        # Particles breathing
        particles = VGroup(*[Dot(radius=0.1, color=BLUE) for _ in range(20)])
        particles.arrange_in_grid(5,4, buff=0.5)

        self.play(FadeIn(particles, scale=0.8))
        self.play(
            LaggedStart(*[particles[i].animate.shift(UP*0.5 + RIGHT*0.3).set_opacity(0.8) for i in range(20)], lag_ratio=0.1),
            run_time=6
        )
        self.play(FadeOut(particles))

        # Glow vignette
        vignette = Circle(radius=SCREEN_WIDTH/2 + 1, color=BLUE, stroke_width=0, fill_opacity=0.1)
        self.play(Create(vignette, run_time=2))
        self.wait(1)

        # Loop end - fade meditative
        self.play(FadeOut(VGroup(lines, group, vignette)), run_time=3)
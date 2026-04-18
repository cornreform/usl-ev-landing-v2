"""
Ultimate Speed Limited - Hero Animation
Concept: Convergence

Run with:
    manim -qh hero_animation.py HeroAnimation
    manim -ql hero_animation.py HeroAnimation  # draft
"""

from manim import *
import numpy as np

# Color palette
BG = "#0D0D0D"
BLUE = "#00A8E0"
TEAL = "#00D4AA"
WHITE = "#FFFFFF"


class HeroAnimation(Scene):
    """Main hero animation - abstract geometric convergence"""
    
    def construct(self):
        self.camera.background_color = BG
        
        # Create flowing lines
        lines = self.create_flowing_lines()
        
        # Create floating particles
        particles = self.create_particles()
        
        # Create central geometric shape
        central = self.create_central_geometry()
        
        # Create energy trails
        trails = self.create_energy_trails()
        
        # Compose layers with staggered timing
        self.add(lines)
        self.wait(2)
        self.add(particles)
        self.wait(2)
        self.add(central)
        self.wait(2)
        self.add(trails)
        
        # Slow ambient animation
        self.wait(22)  # Total ~30 seconds
    
    def create_flowing_lines(self):
        """Horizontal flowing lines representing energy flow"""
        lines = VGroup()
        
        for i in range(5):
            line = Line(
                start=LEFT * 8,
                end=RIGHT * 8,
                stroke_width=2 if i != 2 else 3,
                stroke_opacity=0.3 if i != 2 else 0.5
            )
            line.shift(UP * (i - 2) * 1.2)
            
            # Gradient color
            if i % 2 == 0:
                line.set_color(BLUE)
            else:
                line.set_color(TEAL)
            
            # Slow horizontal animation
            line.generate_target()
            line.target.shift(RIGHT * 4)
            
            lines.add(line)
        
        # Animate lines
        self.play(LaggedStart(*[
            MoveToTarget(line, run_time=8, rate_func=there_and_back)
            for line in lines
        ], lag_ratio=0.2))
        
        return lines
    
    def create_particles(self):
        """Floating particles representing clean energy"""
        particles = VGroup()
        
        for _ in range(30):
            radius = np.random.uniform(0.02, 0.08)
            particle = Circle(
                radius=radius,
                fill_opacity=np.random.uniform(0.2, 0.4),
                stroke_opacity=0
            )
            
            # Random position
            particle.move_to([
                np.random.uniform(-7, 7),
                np.random.uniform(-4, 4),
                0
            ])
            
            # Random color
            particle.set_color(BLUE if np.random.random() > 0.5 else TEAL)
            
            particles.add(particle)
        
        # Gentle floating animation
        for particle in particles:
            particle.generate_target()
            particle.target.shift([
                np.random.uniform(-0.5, 0.5),
                np.random.uniform(-0.5, 0.5),
                0
            ])
        
        self.play(LaggedStart(*[
            MoveToTarget(p, run_time=6, rate_func=sine)
            for p in particles
        ], lag_ratio=0.05))
        
        return particles
    
    def create_central_geometry(self):
        """Central hexagonal shape - symbolizing convergence"""
        # Main hexagon
        hexagons = VGroup()
        
        for i, scale in enumerate([1, 0.8, 0.6]):
            hexagon = RegularPolygon(n=6, radius=scale * 2)
            hexagon.set_stroke(
                WHITE if i == 0 else BLUE if i == 1 else TEAL,
                opacity=0.3 if i == 0 else 0.2
            )
            hexagons.add(hexagon)
        
        hexagons.move_to(ORIGIN)
        
        # Slow rotation
        self.play(Rotate(hexagons, TWO_PI, run_time=20, rate_func=linear))
        
        return hexagons
    
    def create_energy_trails(self):
        """Energy trails suggesting speed"""
        trails = VGroup()
        
        for i in range(8):
            start_x = -8 + i * 0.5
            trail = ParametricFunction(
                lambda t: np.array([
                    start_x + t * 4,
                    2 * np.sin(t * np.pi),
                    0
                ]),
                t_range=[0, 2],
                stroke_width=1,
                stroke_opacity=0.3
            )
            trail.set_color(BLUE if i % 2 == 0 else TEAL)
            trails.add(trail)
        
        # Animate trails appearing and moving
        self.play(
            LaggedStart(*[
                ShowCreation(trail, run_time=2)
                for trail in trails
            ], lag_ratio=0.3),
            run_time=4
        )
        
        return trails


class ParticleField(Scene):
    """Simpler ambient particle field for background"""
    
    def construct(self):
        self.camera.background_color = BG
        
        particles = VGroup()
        
        for _ in range(50):
            p = Dot(
                radius=np.random.uniform(0.02, 0.05),
                fill_opacity=np.random.uniform(0.2, 0.5)
            )
            p.move_to([
                np.random.uniform(-8, 8),
                np.random.uniform(-4, 4),
                0
            ])
            p.set_color(np.random.choice([BLUE, TEAL, WHITE]))
            particles.add(p)
        
        self.add(particles)
        
        # Gentle movement
        for p in particles:
            p.generate_target()
            p.target.move_to([
                np.random.uniform(-8, 8),
                np.random.uniform(-4, 4),
                0
            ])
        
        self.play(
            LaggedStart(*[
                MoveToTarget(p, run_time=8, rate_func=sine)
                for p in particles
            ], lag_ratio=0.02),
            run_time=8
        )
        
        self.wait(2)


if __name__ == "__main__":
    # Test render
    import subprocess
    subprocess.run([
        "manim", "-ql", "hero_animation.py", "HeroAnimation"
    ])

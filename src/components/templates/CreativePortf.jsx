// Featured Template 5: Creative Portfolio
// Stunning, visual-first, artistic design

import React from 'react';

const CreativePortfolio = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Alex Morgan</h1>
            <nav className="hidden md:flex gap-8 text-sm">
              <a href="#" className="hover:text-purple-400 transition">Work</a>
              <a href="#" className="hover:text-purple-400 transition">About</a>
              <a href="#" className="hover:text-purple-400 transition">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center px-4">
          <h2 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CREATIVE
          </h2>
          <p className="text-2xl text-gray-300 mb-8">Visual Designer & Digital Artist</p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition">
            View Portfolio
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold mb-16 text-center">Selected Works</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">Project {i}</h3>
                  <p className="text-gray-300">Digital Art · 2025</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-900 to-pink-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">About Me</h2>
            <p className="text-xl text-gray-300 mb-8">
              I'm a visual designer and digital artist passionate about creating 
              stunning experiences that merge art and technology. With over 10 years 
              of experience, I've worked with brands worldwide to bring their visions to life.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-gray-400">Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-lg">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm text-gray-400">Awards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center">Skills & Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Photoshop', level: 95 },
              { name: 'Illustrator', level: 90 },
              { name: 'After Effects', level: 85 },
              { name: 'Figma', level: 92 },
              { name: 'Blender', level: 80 },
              { name: 'Cinema 4D', level: 88 }
            ].map((skill) => (
              <div key={skill.name} className="bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-purple-400">{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-purple-900 via-black to-pink-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. 
            Let's create something amazing together.
          </p>
          <button className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition">
            Get In Touch
          </button>
        </div>
      </section>

      <footer className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">© 2025 Alex Morgan. Built with CYBEV.io</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Dribbble</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Behance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreativePortfolio;
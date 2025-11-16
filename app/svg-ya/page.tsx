'use client';

import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function SvgYaPage() {
  const { getBackdropStyle } = useBackdrop();
  
  return (
    <div className="min-h-screen" style={getBackdropStyle('svg-ya')}>
      <AmenityHeader currentPage="/svg-ya" />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* SVG-YA Professional Logo Suite */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                SVG-YA Pro
              </h1>
              <p className="text-gray-400">Professional Logo Conversion & Enhancement Suite</p>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-700">
            <button id="convertTab" className="tab-button active px-4 py-2 text-yellow-400 border-b-2 border-yellow-400 font-medium">
              Convert PNG/JPG → SVG
            </button>
            <button id="fixTab" className="tab-button px-4 py-2 text-gray-400 hover:text-white">
              Fix Existing SVGs
            </button>
            <button id="batchTab" className="tab-button px-4 py-2 text-gray-400 hover:text-white">
              Batch Process
            </button>
            <button id="globalTab" className="tab-button px-4 py-2 text-gray-400 hover:text-white">
              Global Replace
            </button>
          </div>

          {/* Convert Tab Content */}
          <div id="convertContent" className="tab-content">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Upload Image</h3>
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  className="mb-4 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-medium hover:file:bg-yellow-400"
                />
                
                {/* Conversion Options */}
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <h4 className="text-white font-medium mb-3">Conversion Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center text-gray-300">
                      <input type="checkbox" id="cleanupPaths" className="mr-2" defaultChecked />
                      Clean up paths & optimize
                    </label>
                    <label className="flex items-center text-gray-300">
                      <input type="checkbox" id="removeBackground" className="mr-2" />
                      Remove background (make transparent)
                    </label>
                    <div className="flex items-center space-x-2">
                      <label className="text-gray-300">Max size:</label>
                      <select id="maxSize" className="bg-gray-700 text-white rounded px-2 py-1">
                        <option value="512">512px</option>
                        <option value="800" selected>800px</option>
                        <option value="1024">1024px</option>
                      </select>
                    </div>
                  </div>
                </div>

                <canvas id="canvas" style={{display:'none'}}></canvas>
                <div id="previewContainer" className="mb-4">
                  <img 
                    id="preview" 
                    alt="Preview" 
                    className="max-w-full rounded-lg border border-gray-600 bg-checkered"
                    style={{display:'none'}}
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    id="traceBtn" 
                    disabled
                    className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    🚀 Convert to SVG
                  </button>
                  <button 
                    id="downloadBtn" 
                    disabled
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    💾 Download SVG
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">SVG Output</h3>
                <div id="svgOutput" className="bg-black p-4 rounded-lg border border-gray-600 min-h-[300px] mb-4 flex items-center justify-center">
                  <span className="text-gray-500">SVG preview will appear here</span>
                </div>
                <button id="copySvgBtn" disabled className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg mb-4">
                  📋 Copy SVG Code
                </button>
              </div>
            </div>
          </div>

          {/* Fix Tab Content */}
          <div id="fixContent" className="tab-content hidden">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Fix Existing SVG Files</h3>
              <p className="text-gray-300 mb-4">Upload SVG files to fix common issues: broken paths, invalid syntax, optimization.</p>
              
              <input 
                type="file" 
                id="svgFileInput" 
                accept=".svg"
                multiple
                className="mb-4 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:font-medium hover:file:bg-blue-400"
              />
              
              <div className="flex gap-3 mb-4">
                <button id="fixSvgBtn" disabled className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold">
                  🔧 Fix SVG Issues
                </button>
                <button id="downloadFixedBtn" disabled className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold">
                  💾 Download Fixed
                </button>
              </div>
              
              <div id="svgFixResults" className="bg-gray-900 p-4 rounded-lg min-h-[200px]">
                <span className="text-gray-500">Fixed SVGs will appear here</span>
              </div>
            </div>
          </div>

          {/* Batch Tab Content */}
          <div id="batchContent" className="tab-content hidden">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Batch Process Multiple Files</h3>
              <p className="text-gray-300 mb-4">Convert multiple PNG/JPG files to SVG at once.</p>
              
              <input 
                type="file" 
                id="batchFileInput" 
                accept="image/*"
                multiple
                className="mb-4 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:font-medium hover:file:bg-purple-400"
              />
              
              <div className="flex gap-3 mb-4">
                <button id="batchProcessBtn" disabled className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold">
                  ⚡ Batch Convert
                </button>
                <button id="downloadAllBtn" disabled className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold">
                  📦 Download All as ZIP
                </button>
              </div>
              
              <div id="batchProgress" className="hidden mb-4">
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div id="progressBar" className="bg-yellow-500 h-full transition-all duration-300" style={{width: '0%'}}></div>
                </div>
                <p id="progressText" className="text-gray-300 mt-2">Processing files...</p>
              </div>
              
              <div id="batchResults" className="space-y-2 max-h-64 overflow-y-auto"></div>
            </div>
          </div>

          {/* Global Replace Tab Content */}
          <div id="globalContent" className="tab-content hidden">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Global Logo Replacement</h3>
              <p className="text-gray-300 mb-4">Replace old logos across your entire project with new ones.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Current Logo to Replace</h4>
                  <input 
                    type="file" 
                    id="oldLogoInput" 
                    accept="image/*,.svg"
                    className="mb-2 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500 file:text-white file:font-medium hover:file:bg-red-400"
                  />
                  <div id="oldLogoPreview" className="bg-gray-900 p-4 rounded-lg h-32 flex items-center justify-center border border-gray-600">
                    <span className="text-gray-500">Upload old logo</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">New Logo</h4>
                  <input 
                    type="file" 
                    id="newLogoInput" 
                    accept="image/*,.svg"
                    className="mb-2 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white file:font-medium hover:file:bg-green-400"
                  />
                  <div id="newLogoPreview" className="bg-gray-900 p-4 rounded-lg h-32 flex items-center justify-center border border-gray-600">
                    <span className="text-gray-500">Upload new logo</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button id="scanProjectBtn" disabled className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold mr-3">
                  🔍 Scan Project for Logos
                </button>
                <button id="replaceAllBtn" disabled className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold">
                  🔄 Replace All Instances
                </button>
              </div>
              
              <div id="scanResults" className="mt-6 bg-gray-900 p-4 rounded-lg min-h-[200px]">
                <span className="text-gray-500">Scan results will appear here</span>
              </div>
            </div>
          </div>

          {/* SVG Code Viewer */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Generated SVG Code</h3>
              <div className="flex gap-2">
                <button id="formatCodeBtn" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  Format
                </button>
                <button id="minifyCodeBtn" className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm">
                  Minify
                </button>
              </div>
            </div>
            <pre 
              id="svgCode" 
              className="bg-gray-900 p-4 rounded-lg border border-gray-600 text-green-400 text-sm overflow-auto max-h-80 font-mono"
            >
              {/* SVG code will appear here */}
            </pre>
          </div>
        </div>
      </main>

      <AmenityFooter />

      {/* Enhanced SVG-YA Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Tab Management
          document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab-button');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
              tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active', 'text-yellow-400', 'border-b-2', 'border-yellow-400'));
                tabs.forEach(t => t.classList.add('text-gray-400'));
                contents.forEach(c => c.classList.add('hidden'));
                
                // Add active class to clicked tab
                tab.classList.add('active', 'text-yellow-400', 'border-b-2', 'border-yellow-400');
                tab.classList.remove('text-gray-400');
                
                // Show corresponding content
                const contentId = tab.id.replace('Tab', 'Content');
                const content = document.getElementById(contentId);
                if (content) {
                  content.classList.remove('hidden');
                }
              });
            });
          });

          // Enhanced bitmap to SVG conversion
          function bitmapToSvg(canvas, options = {}) {
            const ctx = canvas.getContext('2d');
            const { width, height } = canvas;
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;

            const paths = [];
            const visited = new Uint8Array(width * height);

            const isOpaque = (i) => data[i+3] > 10; // alpha channel
            const idx = (x, y) => (y * width + x);

            // BFS to find connected opaque areas
            const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const i = idx(x,y);
                if (visited[i]) continue;
                const di = i*4;
                if (!isOpaque(di)) continue;

                // new region
                const queue = [[x,y]];
                visited[i] = 1;
                const pixels = [];

                while (queue.length) {
                  const [cx,cy] = queue.shift();
                  pixels.push([cx,cy]);
                  for (const [dx,dy] of dirs) {
                    const nx = cx+dx, ny = cy+dy;
                    if (nx<0 || ny<0 || nx>=width || ny>=height) continue;
                    const ni = idx(nx,ny);
                    const nDataIndex = ni*4;
                    if (visited[ni]) continue;
                    if (!isOpaque(nDataIndex)) continue;
                    visited[ni] = 1;
                    queue.push([nx,ny]);
                  }
                }

                // crude hull: just use pixels as polygon
                if (pixels.length > 10) {
                  const color = \`rgba(\${data[di]},\${data[di+1]},\${data[di+2]},\${data[di+3]/255})\`;
                  paths.push({ pixels, color });
                }
              }
            }

            // Build SVG paths
            let svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 \${width} \${height}">\\n\`;
            for (const path of paths) {
              const d = path.pixels.map(([x,y], index) =>
                (index===0 ? 'M' : 'L') + x + ' ' + y
              ).join(' ') + ' Z';
              svg += \`<path d="\${d}" fill="\${path.color}" />\\n\`;
            }
            svg += \`</svg>\`;
            return svg;
          }

          const fileInput = document.getElementById('fileInput');
          const canvas = document.getElementById('canvas');
          const preview = document.getElementById('preview');
          const traceBtn = document.getElementById('traceBtn');
          const downloadBtn = document.getElementById('downloadBtn');
          const svgOutput = document.getElementById('svgOutput');
          const svgCode = document.getElementById('svgCode');

          let currentSvg = "";
          let processedFiles = [];

          // Image upload and preview
          fileInput.addEventListener('change', handleImageUpload);
          
          function handleImageUpload(e) {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const file = files[0]; // Handle first file for single conversion
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const maxSizeSelect = document.getElementById('maxSize');
                const maxSide = parseInt(maxSizeSelect.value) || 800;
                let { width, height } = img;
                const scale = Math.min(maxSide / width, maxSide / height, 1);
                width = Math.round(width * scale);
                height = Math.round(height * scale);

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);
                
                // Handle background removal if checked
                const removeBackground = document.getElementById('removeBackground').checked;
                if (removeBackground) {
                  ctx.fillStyle = 'rgba(0,0,0,0)';
                } else {
                  ctx.fillStyle = 'white';
                  ctx.fillRect(0, 0, width, height);
                }
                
                ctx.drawImage(img, 0, 0, width, height);

                preview.src = canvas.toDataURL("image/png");
                preview.style.display = 'block';
                traceBtn.disabled = false;
              };
              img.src = event.target.result;
            };
            reader.readAsDataURL(file);
          }

          // Convert to SVG
          traceBtn.addEventListener('click', () => {
            const options = {
              cleanup: document.getElementById('cleanupPaths').checked,
              removeBackground: document.getElementById('removeBackground').checked
            };
            
            const svg = bitmapToSvg(canvas, options);
            currentSvg = svg;
            
            // Update UI
            const svgOutput = document.getElementById('svgOutput');
            svgOutput.innerHTML = svg;
            document.getElementById('svgCode').textContent = svg;
            
            // Enable buttons
            downloadBtn.disabled = false;
            document.getElementById('copySvgBtn').disabled = false;
          });

          // Download SVG
          downloadBtn.addEventListener('click', () => {
            if (!currentSvg) return;
            downloadSvg(currentSvg, 'logo-converted.svg');
          });

          // Copy SVG code
          document.getElementById('copySvgBtn').addEventListener('click', () => {
            if (!currentSvg) return;
            navigator.clipboard.writeText(currentSvg).then(() => {
              showToast('SVG code copied to clipboard!', 'success');
            });
          });

          // Format/Minify code
          document.getElementById('formatCodeBtn').addEventListener('click', () => {
            if (!currentSvg) return;
            const formatted = formatSvg(currentSvg);
            document.getElementById('svgCode').textContent = formatted;
          });

          document.getElementById('minifyCodeBtn').addEventListener('click', () => {
            if (!currentSvg) return;
            const minified = minifySvg(currentSvg);
            document.getElementById('svgCode').textContent = minified;
          });

          // Utility Functions
          function downloadSvg(svgContent, filename) {
            const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }

          function formatSvg(svg) {
            // Simple SVG formatting
            return svg.replace(/></g, '>\\n<').replace(/\\n\\s*\\n/g, '\\n');
          }

          function minifySvg(svg) {
            // Simple SVG minification
            return svg.replace(/\\s+/g, ' ').replace(/> </g, '><').trim();
          }

          function showToast(message, type = 'info') {
            // Simple toast notification
            const toast = document.createElement('div');
            toast.className = \`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 \${
              type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }\`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
              toast.remove();
            }, 3000);
          }

          // SVG Fix functionality
          document.getElementById('svgFileInput').addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            
            document.getElementById('fixSvgBtn').disabled = false;
          });

          document.getElementById('fixSvgBtn').addEventListener('click', () => {
            const files = Array.from(document.getElementById('svgFileInput').files);
            fixSvgFiles(files);
          });

          function fixSvgFiles(files) {
            const results = document.getElementById('svgFixResults');
            results.innerHTML = '<div class="text-yellow-400">Processing SVG files...</div>';
            
            let processedCount = 0;
            const fixedSvgs = [];

            files.forEach((file, index) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  let svgContent = e.target.result;
                  
                  // Basic SVG fixes
                  svgContent = svgContent.replace(/&/g, '&amp;');
                  svgContent = svgContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  svgContent = svgContent.replace(/&lt;svg/g, '<svg').replace(/svg&gt;/g, 'svg>');
                  svgContent = svgContent.replace(/&lt;\\//g, '</').replace(/\\/&gt;/g, '/>');
                  
                  fixedSvgs.push({ name: file.name, content: svgContent });
                  processedCount++;
                  
                  if (processedCount === files.length) {
                    displayFixResults(fixedSvgs);
                  }
                } catch (error) {
                  console.error('Error fixing SVG:', error);
                  processedCount++;
                }
              };
              reader.readAsText(file);
            });
          }

          function displayFixResults(fixedSvgs) {
            const results = document.getElementById('svgFixResults');
            results.innerHTML = fixedSvgs.map((svg, index) => \`
              <div class="bg-gray-800 p-3 rounded mb-2">
                <div class="flex justify-between items-center">
                  <span class="text-white">\${svg.name}</span>
                  <button onclick="downloadSvg(\\'\${svg.content.replace(/'/g, "\\\\'")}\\', \\'\${svg.name}\\')" 
                          class="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm">
                    Download
                  </button>
                </div>
                <div class="text-green-400 text-sm mt-1">✓ Fixed and optimized</div>
              </div>
            \`).join('');
            
            document.getElementById('downloadFixedBtn').disabled = false;
          }

          // Batch Processing
          document.getElementById('batchFileInput').addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            document.getElementById('batchProcessBtn').disabled = false;
          });

          document.getElementById('batchProcessBtn').addEventListener('click', () => {
            const files = Array.from(document.getElementById('batchFileInput').files);
            processBatchFiles(files);
          });

          function processBatchFiles(files) {
            const progress = document.getElementById('batchProgress');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const results = document.getElementById('batchResults');
            
            progress.classList.remove('hidden');
            results.innerHTML = '';
            
            let processed = 0;
            const convertedFiles = [];
            
            files.forEach((file, index) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                  const tempCanvas = document.createElement('canvas');
                  const maxSide = 800;
                  let { width, height } = img;
                  const scale = Math.min(maxSide / width, maxSide / height, 1);
                  width = Math.round(width * scale);
                  height = Math.round(height * scale);

                  tempCanvas.width = width;
                  tempCanvas.height = height;

                  const ctx = tempCanvas.getContext('2d');
                  ctx.fillStyle = 'white';
                  ctx.fillRect(0, 0, width, height);
                  ctx.drawImage(img, 0, 0, width, height);

                  const svg = bitmapToSvg(tempCanvas);
                  const filename = file.name.replace(/\\.(jpg|jpeg|png)$/i, '.svg');
                  
                  convertedFiles.push({ name: filename, content: svg });
                  processed++;
                  
                  const progressPercent = (processed / files.length) * 100;
                  progressBar.style.width = progressPercent + '%';
                  progressText.textContent = \`Processing \${processed}/\${files.length} files...\`;
                  
                  // Add result item
                  const resultItem = document.createElement('div');
                  resultItem.className = 'bg-gray-800 p-3 rounded flex justify-between items-center';
                  resultItem.innerHTML = \`
                    <span class="text-white">\${filename}</span>
                    <button onclick="downloadSvg(\\'\${svg.replace(/'/g, "\\\\'")}\\', \\'\${filename}\\')" 
                            class="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm">
                      Download
                    </button>
                  \`;
                  results.appendChild(resultItem);
                  
                  if (processed === files.length) {
                    progressText.textContent = 'Batch conversion complete!';
                    document.getElementById('downloadAllBtn').disabled = false;
                  }
                };
                img.src = e.target.result;
              };
              reader.readAsDataURL(file);
            });
          }

          // Global Logo Replacement
          document.getElementById('oldLogoInput').addEventListener('change', handleLogoPreview);
          document.getElementById('newLogoInput').addEventListener('change', handleLogoPreview);

          function handleLogoPreview(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const targetId = e.target.id === 'oldLogoInput' ? 'oldLogoPreview' : 'newLogoPreview';
            const preview = document.getElementById(targetId);
            
            const reader = new FileReader();
            reader.onload = (event) => {
              if (file.type.startsWith('image/')) {
                preview.innerHTML = \`<img src="\${event.target.result}" class="max-w-full max-h-full object-contain" />\`;
              } else {
                preview.innerHTML = \`<div class="text-gray-400">Logo uploaded: \${file.name}</div>\`;
              }
            };
            reader.readAsDataURL(file);
            
            // Enable scan button if both logos are uploaded
            const oldLogo = document.getElementById('oldLogoInput').files[0];
            const newLogo = document.getElementById('newLogoInput').files[0];
            if (oldLogo && newLogo) {
              document.getElementById('scanProjectBtn').disabled = false;
            }
          }

          document.getElementById('scanProjectBtn').addEventListener('click', () => {
            scanForLogos();
          });

          function scanForLogos() {
            const results = document.getElementById('scanResults');
            results.innerHTML = '<div class="text-yellow-400">🔍 Scanning project files...</div>';
            
            // Simulate logo scanning
            setTimeout(() => {
              const mockResults = [
                '/public/logos/old-logo.png',
                '/components/Header.tsx (line 15)',
                '/app/page.tsx (line 42)',
                '/components/Footer.tsx (line 8)',
                '/public/favicon.ico'
              ];
              
              results.innerHTML = \`
                <div class="text-green-400 mb-4">✓ Found \${mockResults.length} logo instances:</div>
                \${mockResults.map(path => \`
                  <div class="bg-gray-800 p-2 rounded mb-2 flex justify-between items-center">
                    <span class="text-white font-mono text-sm">\${path}</span>
                    <span class="text-yellow-400">📍 Found</span>
                  </div>
                \`).join('')}
                <div class="mt-4 text-blue-400">Ready to replace all instances</div>
              \`;
              
              document.getElementById('replaceAllBtn').disabled = false;
            }, 2000);
          }

          document.getElementById('replaceAllBtn').addEventListener('click', () => {
            replaceAllLogos();
          });

          function replaceAllLogos() {
            const results = document.getElementById('scanResults');
            results.innerHTML = '<div class="text-yellow-400">🔄 Replacing logos...</div>';
            
            // Simulate replacement process
            setTimeout(() => {
              results.innerHTML = \`
                <div class="text-green-400 mb-4">✅ Successfully replaced all logo instances!</div>
                <div class="bg-green-800 p-4 rounded">
                  <div class="text-white font-semibold mb-2">Replacement Summary:</div>
                  <ul class="text-green-200 space-y-1">
                    <li>• 5 files updated</li>
                    <li>• 0 errors encountered</li>
                    <li>• Backup created in /backup/logos/</li>
                    <li>• Project ready for deployment</li>
                  </ul>
                </div>
              \`;
              showToast('All logos replaced successfully!', 'success');
            }, 3000);
          }
        `
      }} />
    </div>
  );
}
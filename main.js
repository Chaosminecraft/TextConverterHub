// ==========================================
// 1. TEIL: GITHUB API DATA FETCH
// ==========================================
document.querySelectorAll('.github-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Verhindert das Neuladen der Seite
        
        const apiUrl = this.getAttribute('data-url');
        const iframe = document.getElementById('iframebrowsertoggle');
        const githubDiv = document.getElementById('github-inhalt');

        console.log("Trigger ausgelöst! Lade Daten von: " + apiUrl);
        
        // Iframe ausblenden, GitHub-Box anzeigen
        if (iframe) iframe.style.display = 'none';
        if (githubDiv) {
            githubDiv.style.width = '100%';
            githubDiv.style.display = 'inline-block';
            githubDiv.innerHTML = "Lade Daten von GitHub...";
        }

        // Daten von GitHub abrufen
        fetch(apiUrl)
            .then(response => response.json())
            .then(releases => {
                if (!githubDiv) return;

                if (!releases || releases.length === 0 || releases.message === "Not Found") {
                    githubDiv.innerHTML = "<h3>Keine Releases gefunden oder Repository nicht erreichbar.</h3>";
                    return;
                }

                let htmlInhalt = "<h2>Projekt Releases auf GitHub</h2>";
                releases.forEach(rel => {
                    htmlInhalt += `
                        <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                            <h3>Version: ${rel.name || rel.tag_name}</h3>
                            <p>Veröffentlicht am: ${new Date(rel.published_at).toLocaleDateString()}</p>
                            <a href="${rel.html_url}" target="_blank" style="background: #2da44e; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px;">Download auf GitHub</a>
                        </div>
                    `;
                });
                
                githubDiv.innerHTML = htmlInhalt;
            })
            .catch(error => {
                if (githubDiv) githubDiv.innerHTML = "Fehler beim Laden der GitHub-Daten.";
                console.error(error);
            });
    });
});

// ==========================================
// 1b. TEIL: GITHUB CONTENTS FETCH (Für Custom-Encoder Ordner)
// ==========================================
document.querySelectorAll('.github-contents-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const apiUrl = this.getAttribute('data-url');
        const iframe = document.getElementById('iframebrowsertoggle');
        const githubDiv = document.getElementById('github-inhalt');

        console.log("Ordner-Trigger ausgelöst! Lade Verzeichnis von: " + apiUrl);
        
        if (iframe) iframe.style.display = 'none';
        if (githubDiv) {
            githubDiv.style.display = 'block';
            githubDiv.innerHTML = "Lade Ordnerstruktur von GitHub...";
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(contents => {
                if (!githubDiv) return;

                if (!contents || !Array.isArray(contents)) {
                    githubDiv.innerHTML = "<h3>Fehler beim Laden der Repository-Inhalte.</h3>";
                    return;
                }

                // Wir filtern nur Einträge heraus, die Ordner (dir) sind
                const releaseFolders = contents.filter(item => item.type === 'dir');

                if (releaseFolders.length === 0) {
                    githubDiv.innerHTML = "<h3>Keine Release-Ordner im Hauptverzeichnis gefunden.</h3>";
                    return;
                }

                let htmlInhalt = "<h2>Alte Versionen im Repository (Custom-Encoder)</h2>";
                htmlInhalt += "<p style='color: #666; font-style: italic;'>Hinweis: Dieses Repository ist archiviert. Die Versionen liegen als Ordner vor.</p><br>";
                
                releaseFolders.forEach(folder => {
                    // Erstellt einen direkten Link zur Ordner-Ansicht auf GitHub
                    const folderUrl = `https://github.com/Chaosminecraft/Custom-Encoder/tree/main/Release%20Versions/${encodeURIComponent(folder.name)}`;
                    
                    htmlInhalt += `
                        <div style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                            <h3>📂 ${folder.name}</h3>
                            <a href="${folderUrl}" target="_blank" style="background: #0284c7; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 5px;">Ordner auf GitHub öffnen</a>
                        </div>
                    `;
                });
                
                githubDiv.innerHTML = htmlInhalt;
            })
            .catch(error => {
                if (githubDiv) githubDiv.innerHTML = "Fehler beim Laden der Verzeichnisdaten.";
                console.error(error);
            });
    });
});

// ==========================================
// 1c. TEIL: GOOGLE DRIVE EMBED WORKAROUND
// ==========================================
document.querySelectorAll('.drive-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Verhindert das Neuladen der Seite
        
        const iframe = document.getElementById('iframebrowsertoggle');
        const githubDiv = document.getElementById('github-inhalt');

        console.log("Google Drive Info-Box generiert.");
        
        // Iframe verstecken, Content-Box anzeigen
        if (iframe) iframe.style.display = 'none';
        if (githubDiv) {
            githubDiv.style.display = 'block';
            
            // Wir bauen ein schönes HTML-Interface direkt in deine Box
            githubDiv.innerHTML = `
                <h2>Alte Versionen auf Google Drive (Pre Alpha / Beta)</h2>
                <p style="color: #444; font-size: 1.1rem; line-height: 1.5; margin-bottom: 20px;">
                    Da Google den direkten Zugriff auf Ordnerstrukturen innerhalb fremder Webseiten blockiert, 
                    kannst du die ganz alten Versionen (Pre Alpha bis Beta) direkt im sicheren Google Drive Verzeichnis einsehen und herunterladen.
                </p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
                    <h3 style="margin-top: 0; color: #1e293b;">📦 Ordner "Custom encoder"</h3>
                    <p style="color: #64748b; margin-bottom: 15px;">Status: Öffentlich freigegeben</p>
                    <a href="https://drive.google.com/drive/folders/16AcLcgRRLlM7chKUi4eHgT-NOfBCnArM?usp=drive_link" 
                       target="_blank" 
                       style="background: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                       Ordner auf Google Drive öffnen ➔
                    </a>
                </div>
            `;
        }
    });
});

// ==========================================
// 1c. TEIL: GOOGLE DRIVE PUBLIC FETCH (KORRIGIERT)
// ==========================================
document.querySelectorAll('.drive-link-alt').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const apiUrl = this.getAttribute('data-url');
        const iframe = document.getElementById('iframebrowsertoggle');
        const githubDiv = document.getElementById('github-inhalt');

        console.log("Drive-Trigger ausgelöst! Lade Daten von: " + apiUrl);
        
        if (iframe) iframe.style.display = 'none';
        if (githubDiv) {
            githubDiv.style.display = 'inline-block';
            githubDiv.innerHTML = "Lade Daten von Google Drive...";
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Google Drive antwortete mit Status: " + response.status);
                }
                return response.text(); // XML als Text laden
            })
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                if (!githubDiv) return;

                // Google nutzt im Standard-Feed "entry" für jede Datei
                const entries = data.querySelectorAll("entry");
                
                if (!entries || entries.length === 0) {
                    githubDiv.innerHTML = "<h3>Keine Dateien gefunden oder der Ordner ist nicht auf 'Jeder mit dem Link' eingestellt.</h3>";
                    return;
                }

                let htmlInhalt = "<h2>Alte Versionen auf Google Drive (Pre Alpha / Beta)</h2>";
                
                entries.forEach(entry => {
                    // Titel der Datei auslesen
                    const titleElement = entry.querySelector("title");
                    const title = titleElement ? titleElement.textContent : "Unbekannte Datei";
                    
                    // Wir suchen nach dem Link, der den alternativen Web-View-Link enthält
                    let driveUrl = "#";
                    const links = entry.querySelectorAll("link");
                    links.forEach(l => {
                        if (l.getAttribute("rel") === "alternate") {
                            driveUrl = l.getAttribute("href");
                        }
                    });
                    
                    htmlInhalt += `
                        <div style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px; font-family: sans-serif;">
                            <h3>📦 ${title}</h3>
                            <a href="${driveUrl}" target="_blank" style="background: #4285F4; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 5px;">Auf Google Drive öffnen</a>
                        </div>
                    `;
                });
                
                githubDiv.innerHTML = htmlInhalt;
            })
            .catch(error => {
                // Wenn es ein CORS-Problem ist, fangen wir es hier ab und bieten einen Rettungsanker an
                if (githubDiv) {
                    githubDiv.innerHTML = `
                        <h3>Google Drive blockiert den direkten Datenabruf (CORS).</h3>
                        <p>Da der Browser den direkten XML-Zugriff blockiert, klicke einfach auf den Button unten, um die Dateien direkt bei Google Drive zu sehen:</p>
                        <br>
                        <a href="https://drive.google.com/drive/folders/1pZ4D6pPCJ6BjcJHpM9oPrTekgQ5jsNwt?usp=drive_link" target="_blank" style="background: #4285F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Ordner direkt öffnen</a>
                    `;
                }
                console.error(error);
            });
    });
});

// ==========================================
// 1d. TEIL: GITHUB CONTENTS FETCH (Text-Converter Beta Branch)
// ==========================================
document.querySelectorAll('.github-beta-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const apiUrl = this.getAttribute('data-url');
        const iframe = document.getElementById('iframebrowsertoggle');
        const githubDiv = document.getElementById('github-inhalt');

        console.log("Lade Beta-Dateistruktur von: " + apiUrl);
        
        if (iframe) iframe.style.display = 'none';
        if (githubDiv) {
            githubDiv.style.display = 'block';
            githubDiv.style.width = '100%';
            githubDiv.style.boxSizing = 'border-box';
            githubDiv.innerHTML = "Lade aktuelle Beta-Dateien von GitHub...";
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("GitHub API-Fehler: " + response.status);
                return response.json();
            })
            .then(contents => {
                if (!githubDiv) return;

                if (!contents || !Array.isArray(contents)) {
                    githubDiv.innerHTML = "<h3>Fehler beim Laden der Dateiliste.</h3>";
                    return;
                }

                let htmlInhalt = "<h2>Aktuelle Dateien im Beta-Branch (Text-Converter)</h2>";
                htmlInhalt += "<p style='color: #666; font-style: italic; margin-bottom: 15px;'>Hier siehst du die Live-Dateien des Entwickler-Branches. Diese Versionen sind unkompiliert.</p>";

                // Diese Dateien filtern wir heraus, damit die Liste sauber bleibt
                const ignoredFiles = ['.gitignore', '.gitattributes', 'LICENSE', 'README.md'];
                const filteredFiles = contents.filter(item => !ignoredFiles.includes(item.name));

                filteredFiles.forEach(item => {
                    // Ordner bekommen ein anderes Icon als Dateien
                    const icon = item.type === 'dir' ? '📂' : '📄';
                    
                    // Link führt direkt zur Datei/Ordner im Beta-Branch auf GitHub
                    const fileUrl = `https://github.com/Chaosminecraft/text-converter/blob/Beta/${item.path}`;

                    htmlInhalt += `
                        <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;">
                            <span style="font-size: 1.05rem;">${icon} <strong>${item.name}</strong></span>
                            <a href="${fileUrl}" target="_blank" style="background: #24292e; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 0.85rem; font-weight: bold;">Code ansehen</a>
                        </div>
                    `;
                });
                
                githubDiv.innerHTML = htmlInhalt;
            })
            .catch(error => {
                if (githubDiv) githubDiv.innerHTML = "<h3>Fehler beim Laden der Verzeichnisdaten.</h3>";
                console.error(error);
            });
    });
});

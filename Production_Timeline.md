Week 1: Finish core CRUD integration
------------------------------------

*   **Hook up Supabase across the board**:
    
    *   Finalise the videos.service.ts functions (fetchVideos, uploadVideo) and ensure the athletes.service.ts functions work as intended.
        
    *   Replace the placeholder state in useVideos and useAthletes with real fetch calls and expose setters to update lists.
        
*   **Add forms/modals**:
    
    *   Implement an **Add Athlete** modal with fields for name, position and notes that calls createAthlete and updates state.
        
    *   Hook up file uploads on the **Videos** page so selecting a file triggers uploadVideo and prepends the returned metadata to the list.
        
*   **Test integration locally**: run the app using pnpm run dev; verify that new athletes appear in the list and that uploaded videos show up in Supabase Storage and in the UI.
    

Week 2: Video analysis & session detail
---------------------------------------

*   **Build the Video Detail page**:
    
    *   Implement a player with controls for frame‑by‑frame playback.
        
    *   Integrate your existing annotation tools (draw lines/angles, erase, reset) and persist annotations per video.
        
*   **Add side‑by‑side comparisons**:
    
    *   Allow coaches to load two videos and sync playback to compare swings.
        
*   **Improve the Analyze page**:
    
    *   Expose the annotation tools separately for live recorded clips or uploaded videos.
        
    *   If you plan to use pose detection (e.g. TensorFlow/MediaPipe) for auto‑analysis, start prototyping.
        

Week 3: Athletes & analytics
----------------------------

*   **Athlete profiles**:
    
    *   Create a profile page that lists an athlete’s sessions (videos), notes, and progress metrics.
        
    *   Allow editing of notes and position.
        
*   **Performance dashboard**:
    
    *   Define key metrics (e.g. bat speed, swing angle, pitch velocity) and decide how you’ll record them.
        
    *   Use a charting library (such as Recharts, already available) to visualise trends over time.
        
*   **Search/filter**:
    
    *   Implement search inputs in your top navigation to filter athletes or videos by name, date or tags.
        

Week 4: User management & polish
--------------------------------

*   **Authentication**:
    
    *   Add Supabase Auth or another provider to support coach login and protect private data.
        
    *   Restrict routes so that only authenticated users can upload or annotate videos.
        
*   **Refactor structure**:
    
    *   Decide whether to fully commit to a features‑based layout or keep pages—delete unused files to avoid confusion.
        
    *   Add a .gitignore and README.md describing setup, environment variables, and deployment instructions.
        
*   **UI/UX refinement**:
    
    *   Enhance responsiveness on mobile; polish cards, forms and modals; add loading spinners and error states.
        
    *   Consolidate icons and styling so the design feels cohesive.
        

Week 5: Testing & deployment
----------------------------

*   **End‑to‑end testing**:
    
    *   Write basic integration tests (e.g. Cypress or Playwright) covering common user flows: login, create athlete, upload video, annotate.
        
    *   Fix any bugs uncovered in testing.
        
*   **Continuous integration**:
    
    *   Set up GitHub Actions (or Netlify’s CI) to run tests on each push.
        
*   **Deployment**:
    
    *   Ensure VITE\_SUPABASE\_URL and VITE\_SUPABASE\_ANON\_KEY are configured in Netlify environment variables.
        
    *   Build and deploy; verify that uploads and database writes work in production.
        
*   **Documentation**:
    
    *   Update the README with deployment steps, .env setup, and user instructions.
        

Week 6 and beyond: Feedback & enhancements
------------------------------------------

*   **Gather user feedback** from players/coaches and prioritise improvements.
    
*   **Add nice‑to‑have features**:
    
    *   Push notifications or email summaries when new videos are uploaded or notes are added.
        
    *   Role‑based access (e.g. athletes can only view their own sessions).
        
    *   Advanced analytics like heatmaps of swing paths or aggregated team stats.
        
*   **Performance tuning**:
    
    *   Optimise video loading with thumbnails and lazy loading.
        
    *   Monitor Supabase costs and adjust storage policies if necessary.
// Supabase settings for Signal. Copy this file to config.js and fill in your project's values
// (Supabase dashboard → Project Settings → API).
//
//   url:     the Project URL, e.g. 'https://abcdefghijkl.supabase.co'
//   anonKey: the "anon public" key. It is designed to be public: the database's access rules only let it read.
//
// NEVER put the service_role key here. It bypasses every access rule.
// If config.js is missing or these are blank, the app uses its local synthetic data instead.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.config = {
  supabase: {
    url: '',
    anonKey: ''
  }
};

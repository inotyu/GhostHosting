import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://fbcjqidmblzocncmjcga.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY2pxaWRtYmx6b2NuY21qY2dhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIyNTgzMiwiZXhwIjoyMDkxODAxODMyfQ.uFe6g-1WM5z5GEyx9uIcZIWI2tEFzcubaHBFFvPQvyA';
const supabaseBucket = process.env.SUPABASE_BUCKET || 'ghost-hosting';

export const supabase = createClient(supabaseUrl, supabaseKey);

export { supabaseBucket };

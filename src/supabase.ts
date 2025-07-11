import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cbuiltqjigfuuvrormsw.supabase.co"
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidWlsdHFqaWdmdXV2cm9ybXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDMxODQsImV4cCI6MjA2NzcxOTE4NH0.SCwHghHc2u0Wqm97flQJa5nnzGQZ5UY3cy0kpecpHgc'


export const supabase = createClient(supabaseUrl,supabaseKey)
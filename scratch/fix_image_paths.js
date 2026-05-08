const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

async function fixPaths() {
    console.log("Reading images from:", IMAGES_DIR);
    const localImages = fs.readdirSync(IMAGES_DIR);
    console.log(`Found ${localImages.length} local images.`);

    const { data: products, error } = await supabase.from('products').select('*');
    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Checking ${products.length} products...`);

    for (const product of products) {
        let updated = false;
        let newImageUrl = product.image;

        if (product.image) {
            // Extract filename from URL
            const filename = product.image.split('/').pop().split('?')[0];
            
            // Check if this filename exists locally
            const matchingFile = localImages.find(f => f.toLowerCase() === filename.toLowerCase());
            
            if (matchingFile) {
                newImageUrl = `/images/${matchingFile}`;
                if (newImageUrl !== product.image) {
                    updated = true;
                    console.log(`Updating ${product.name}: ${product.image} -> ${newImageUrl}`);
                }
            }
        }

        if (updated) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ image: newImageUrl })
                .eq('id', product.id);
            
            if (updateError) {
                console.error(`Failed to update ${product.name}:`, updateError);
            }
        }
    }
    console.log("Finished fixing paths.");
}

fixPaths();

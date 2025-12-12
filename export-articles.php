<?php
/**
 * Export artykułów z WordPress do JSON
 * 
 * INSTRUKCJA:
 * 1. Wgraj ten plik do głównego katalogu WordPress (gdzie jest wp-config.php)
 * 2. Otwórz w przeglądarce: https://www.interpunkcja.com.pl/export-articles.php
 * 3. Zapisz wynikowy JSON
 * 4. Usuń plik z serwera!
 */

// Załaduj WordPress
require_once('wp-load.php');

// Sprawdź czy user jest zalogowany jako admin (opcjonalne zabezpieczenie)
// if (!current_user_can('administrator')) {
//     die('Brak uprawnień');
// }

header('Content-Type: application/json; charset=utf-8');

// Pobierz wszystkie opublikowane posty
$args = array(
    'post_type' => 'post',
    'post_status' => 'publish',
    'posts_per_page' => -1, // wszystkie
    'orderby' => 'date',
    'order' => 'DESC'
);

$posts = get_posts($args);
$articles = array();

foreach ($posts as $post) {
    // Pobierz kategorię
    $categories = get_the_category($post->ID);
    $categorySlug = '';
    $categoryName = '';
    
    if (!empty($categories)) {
        $categorySlug = $categories[0]->slug;
        $categoryName = $categories[0]->name;
    }
    
    // Pobierz excerpt lub wygeneruj
    $excerpt = $post->post_excerpt;
    if (empty($excerpt)) {
        $excerpt = wp_trim_words(strip_tags($post->post_content), 30, '...');
    }
    
    // Pobierz meta SEO (jeśli używasz Yoast lub podobnego)
    $metaTitle = get_post_meta($post->ID, '_yoast_wpseo_title', true);
    $metaDescription = get_post_meta($post->ID, '_yoast_wpseo_metadesc', true);
    
    // Alternatywne pola SEO (RankMath)
    if (empty($metaTitle)) {
        $metaTitle = get_post_meta($post->ID, 'rank_math_title', true);
    }
    if (empty($metaDescription)) {
        $metaDescription = get_post_meta($post->ID, 'rank_math_description', true);
    }
    
    $articles[] = array(
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'content' => $post->post_content,
        'excerpt' => $excerpt,
        'categorySlug' => $categorySlug,
        'categoryName' => $categoryName,
        'metaTitle' => $metaTitle ?: $post->post_title,
        'metaDescription' => $metaDescription ?: $excerpt,
        'publishedAt' => $post->post_date,
        'url' => get_permalink($post->ID),
    );
}

// Pobierz też kategorie
$categories = get_categories(array(
    'hide_empty' => false,
));

$categoriesExport = array();
foreach ($categories as $cat) {
    $categoriesExport[] = array(
        'name' => $cat->name,
        'slug' => $cat->slug,
        'description' => $cat->description,
        'count' => $cat->count,
    );
}

$result = array(
    'exportDate' => date('Y-m-d H:i:s'),
    'articlesCount' => count($articles),
    'categoriesCount' => count($categoriesExport),
    'categories' => $categoriesExport,
    'articles' => $articles,
);

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
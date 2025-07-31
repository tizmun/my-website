// script.js

document.addEventListener('DOMContentLoaded', () => {
    // קבלת הפניות לאלמנטים ב-DOM
    const filterButtons = document.querySelectorAll('.filter-btn'); // כל כפתורי הסינון
    const imageItems = document.querySelectorAll('.image-item'); // כל קונטיינרי התמונות
    const lightbox = document.getElementById('lightbox'); // אלמנט ה-lightbox
    const lightboxImg = document.getElementById('lightbox-img'); // התמונה בתוך ה-lightbox
    const closeBtn = document.querySelector('.close-btn'); // כפתור סגירה של ה-lightbox
    const prevBtn = document.getElementById('prev-btn'); // כפתור "קודם" ב-lightbox
    const nextBtn = document.getElementById('next-btn'); // כפתור "הבא" ב-lightbox

    let currentImageIndex; // משתנה לשמירת האינדקס של התמונה המוצגת כרגע ב-lightbox
    let filteredImages = []; // מערך של התמונות המסוננות הנוכחיות

    // --- לוגיקת סינון קטגוריות ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // הסרת הקלאס 'active' מכל הכפתורים
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // הוספת הקלאס 'active' לכפתור שנלחץ
            button.classList.add('active');

            const category = button.dataset.category; // קבלת הקטגוריה מהכפתור

            // איפוס מערך התמונות המסוננות
            filteredImages = [];

            imageItems.forEach(item => {
                const itemCategory = item.dataset.category; // קבלת הקטגוריה של פריט התמונה

                // הצגה או הסתרה של פריטי התמונות בהתאם לקטגוריה
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'flex'; // הצגה כ-flex כדי לשמור על מרכוז
                    filteredImages.push(item); // הוספת התמונה למערך המסונן
                } else {
                    item.style.display = 'none'; // הסתרת התמונה
                }
            });
        });
    });

    // --- לוגיקת פתיחת Lightbox ---
    imageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // לוודא שמערך התמונות המסוננות מעודכן לפני הפתיחה
            // (במקרה שהמשתמש לוחץ על תמונה לפני סינון)
            // אם המערך ריק, יש למלא אותו בכל התמונות.
            if (filteredImages.length === 0) {
                 imageItems.forEach(imgItem => filteredImages.push(imgItem));
            }

            // מציאת האינדקס של התמונה שנלחצה בתוך מערך התמונות המסוננות
            currentImageIndex = filteredImages.indexOf(item);

            // קבלת ה-src של התמונה הגדולה (אם קיים, אחרת שימוש ב-src הרגיל)
            const largeSrc = item.querySelector('img').dataset.largeSrc || item.querySelector('img').src;
            lightboxImg.src = largeSrc; // הצגת התמונה ב-lightbox
            lightbox.style.display = 'flex'; // הצגת ה-lightbox (כ-flex למיקום)
            document.body.style.overflow = 'hidden'; // מניעת גלילה של הרקע כש-lightbox פתוח
        });
    });

    // --- לוגיקת סגירת Lightbox ---
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none'; // הסתרת ה-lightbox
        document.body.style.overflow = 'auto'; // החזרת גלילה לרקע
    });

    // סגירת lightbox בלחיצה מחוץ לתמונה (על הרקע השחור)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- לוגיקת ניווט ב-Lightbox ---
    function showImage(index) {
        if (index < 0) {
            currentImageIndex = filteredImages.length - 1; // אם הגענו לסוף, עבור לתמונה האחרונה
        } else if (index >= filteredImages.length) {
            currentImageIndex = 0; // אם הגענו להתחלה, עבור לתמונה הראשונה
        } else {
            currentImageIndex = index;
        }

        const imgElement = filteredImages[currentImageIndex].querySelector('img');
        const largeSrc = imgElement.dataset.largeSrc || imgElement.src;
        lightboxImg.src = largeSrc; // עדכון התמונה ב-lightbox
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // מונע סגירת ה-lightbox בלחיצה על הכפתור
        showImage(currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // מונע סגירת ה-lightbox בלחיצה על הכפתור
        showImage(currentImageIndex + 1);
    });

    // ניווט באמצעות מקשי חצים (אופציונלי)
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') { // רק אם ה-lightbox פתוח
            if (e.key === 'ArrowLeft') { // חץ שמאלה
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') { // חץ ימינה
                showImage(currentImageIndex + 1);
            } else if (e.key === 'Escape') { // מקש Esc
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    // אתחול: לוודא שהכפתור "הכל" פעיל וכל התמונות מוצגות בהתחלה
    document.querySelector('.filter-btn[data-category="all"]').click();
});
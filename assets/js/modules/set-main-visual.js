import { microcms } from "../microcms.js";

export const setMainVisual = () => {
  $(function () {
    // ----------------------------------------------
    // TOP メインビジュアル
    // ----------------------------------------------
    fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/settings`, {
      headers: {
        "X-MICROCMS-API-KEY": microcms.API_KEY,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const desktopImages = json.main_visual_images.desktop_images;
        const mobileImages = json.main_visual_images.mobile_images;
        const breakpoint = 767;
        let insertHtml = $('<div class="swiper-wrapper"></div>');

        if (window.matchMedia(`(max-width: ${breakpoint}px)`).matches) {
          // mobile(767px以下)
          if (mobileImages.length >= 1) {
            for (const item of mobileImages) {
              const addItem = `
              <div class="swiper-slide p-mainViual__image">
                <img src="${item.url}" alt="" width="${item.width}" height="${item.height}" />
              </div>
              `;
              insertHtml.append(addItem);
            }
          } else {
            const addItem = `
            <div class="p-mainViual__image">
              <img
                src="./assets/images/no_image_sp.png"
                alt="no image"
                width="375"
                height="648"
              />
            </div>
            `;
            insertHtml.append(addItem);
          }
        } else {
          // desktop
          if (desktopImages.length >= 1) {
            for (const item of desktopImages) {
              const addItem = `
              <div class="swiper-slide p-mainViual__image">
                <img src="${item.url}" alt="" width="${item.width}" height="${item.height}" />
              </div>
              `;
              insertHtml.append(addItem);
            }
          } else {
            const addItem = `
            <div class="p-mainViual__image">
              <img
                src="./assets/images/no_image_pc.png"
                alt="no image"
                width="1024"
                height="592"
              />
            </div>
            `;
            insertHtml.append(addItem);
          }
        }
        $("#js-setMainVisual").append(insertHtml);

        // Swiper init
        var swiper = new Swiper(".js-mainVisualSwiper", {
          effect: json.main_visual_images.effect[0],
          loop: true,
          autoplay: {
            delay: json.main_visual_images.delay_speed,
          },
          speed: json.main_visual_images.animation_speed,
        });
      });
  });
};

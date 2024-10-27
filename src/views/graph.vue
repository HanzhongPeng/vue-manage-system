<template>
    <div class="iframe-container">
        <iframe 
            ref="iframe"
            src="http://localhost:3000" 
            width="100%" 
            frameborder="0" 
            style="border: none;">
        </iframe>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';

const iframe = ref(null);

const adjustIframeHeight = () => {
    if (iframe.value) {
        iframe.value.style.height = `${window.innerHeight}px`;
    }
};

onMounted(() => {
    adjustIframeHeight();
    window.addEventListener('resize', adjustIframeHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', adjustIframeHeight);
});
</script>

<style scoped>
.iframe-container {
    width: 100%;
    height: 100vh; /* 设置容器高度为视口高度 */
    overflow: hidden;
}

.iframe-container iframe {
    width: 100%;
}
</style>

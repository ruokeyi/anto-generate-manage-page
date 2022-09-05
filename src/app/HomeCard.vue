<template>
  <div :class="`card card--${empty?'empty':'full'}`"
       :style="`flex:${flex};flex-shrink:${empty?flex:0};background:${background}`">
    <template v-if="!empty">
    <span class="title">
      <i :class="`iconfont ${icon}`"></i>
      <span style="font-size: 16px;margin-left: 8px;">{{ title }}</span>
    </span>
      <div class="homecard__content">
        <slot/>
        <div style="text-align: left;width: 100%">
          <a v-if="url" :href="$universalURL(url)" style="color: var(--color-primary)">点此跳转</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'HomeCard',
  props: {
    icon: String,
    title: String,
    empty: {type: Boolean, default: false},
    flex: {type: String, default: '5'},
    background: {type: String, default: '#fff'},
    url: {type: String, default: null, required: false},
  },
};
</script>

<style scoped lang="stylus">

len = 25vmin
lenx = 15vw
minw = 200px

.card {
  width: lenx;
  height: len;
  min-width minw;
  min-height: 20px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column
  position: relative
  margin: 8px
  transition: all 0.3s
  overflow: hidden
  flex-shrink 1

  &.card--full {
    min-height: 40px

    &:hover {
      flex: 20 0 0 !important
    }
  }
}

.homecard__content {
  width: lenx;
  height: len;
  min-width minw;
  position: absolute
  display: flex
  justify-content: center;
  align-items: center;
  flex-direction: column
  left: 0
  top: 0
  padding: 8px 24px
  font-size: 1.3vmin
  opacity: 0
  transition all 0.2s
}

.title {
  //position: relative;
  //line-height: 24px
  display: flex
  justify-content: center
  align-items: center
  opacity 1
  transition all 0.2s

  .iconfont {
    //position: absolute
    //left: 0
    //transform translateX(-100%)
    font-size: 24px
  }
}

.card:hover {
  .homecard__content {
    width: 100%
    height: 100%
    opacity 1
  }

  .title {
    opacity: 0
  }
}
</style>

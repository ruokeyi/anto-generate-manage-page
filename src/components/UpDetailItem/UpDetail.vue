<template>
  <div class="UpDetailCard" :class="`UpDetailCard--${size}`">
    <template v-if="['mini'].includes(size)">
      <div style="display: flex;align-items: center;justify-content: center;">
        <div class="avatar-outset"
             :style="avatarBg(data)" style="width: 22px;height: 22px;overflow: hidden;">
          <div v-if="placeholder"
               class="avatar-placeholder">
            {{ placeholder }}
          </div>
          <div v-else class="avatar" style="width: 18px;height: 18px;">
            <img
                class="avatar-img" style="width: 18px;height: 18px;"
                :src="data[avatar]" :alt="data[name]"
                @load="imgLoad" @error="imgError"
            />
          </div>
        </div>
        <div style="margin-left: 5px;width: 96px;font-size: 12px;" class="OneLineText">
          <div class="text">{{ data[name] }}</div>
        </div>
      </div>
    </template>

    <template v-if="['middle','small'].includes(size)">
      <div class="column column--avatar">
        <div class="avatar-outset"
             :style="avatarBg(data)">
          <div v-if="placeholder"
               class="avatar-placeholder">
            {{ placeholder }}
          </div>
          <a v-else :href="`https://space.bilibili.com/${data[mid]}/`" target="_blank">
            <div class="avatar" style="border: 0;">
              <img
                  :src="data[avatar]" @load="imgLoad"
                  @error="imgError"
                  :alt="data[name]" class="avatar-img"/>
            </div>
          </a>
          <el-tooltip v-if="!placeholder && !$hideBiliScore">
            <template #content>
              <div>创作力:{{ data[qualityScore] }}</div>
              <div>影响力:{{ data[prScore] }}</div>
              <div>信用分:{{ data[creditScore] }}</div>
            </template>
            <div class="level" v-if="!$hideBiliScore">
              <div style="height: 15px">Lv</div>
              <div style="font-size: 16px;">{{ data[level] }}</div>
            </div>
          </el-tooltip>
        </div>
        <div class="OneLineText" style="width: 100%;height: 22px;">
          <el-popover placement="top-start" :content="data[name]">
            <template #reference>
              <div class="text">
                {{ data[name] }}
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </template>
    <template v-if="['middle'].includes(size)">
      <div v-if="showBasicNumbers" class="column column--basic-numbers">

        <div class="ListItem">
          <i class="iconfont iconfensi1"></i>
          <span class="number">{{ fansCountT }}</span>
        </div>

        <div class="ListItem">
          <i class="iconfont iconbofang4"></i>
          <span class="number">{{ playAvg180T }}</span>
        </div>

        <div class="ListItem">
          <i class="iconfont iconbozhuanfen1" style="color:#000"></i>
          <span class="number">{{ convert }}</span>
        </div>
      </div>

    <div class="column column--basic-info">

      <div class="ListItem">
        <router-link
            v-if="data[mid]"
            class="OneLineText" style="color:cornflowerblue;"
            :to="{name:'up-detail',query:{mid:data[mid],tab:toDetailTab}}"
            target="_blank">
          {{ data[mid] }} <i class="el-icon-link"></i>
        </router-link>
        <div v-else>
          -
        </div>
      </div>

      <div class="ListItem OneLineText">
        <span class="text">
          <m-show-more :effect="'light'" :tip-width="'15vw'">{{ category }}</m-show-more>
        </span>
      </div>

      <div style="display: flex;" class="ListItem">
        <div class="VerifyIcon">
          <img v-if="qualificationT==='yellow'" :src="IconLightningYellow" alt="个人认证">
          <img v-if="qualificationT==='blue'" :src="IconLightningBlue" alt="机构认证">
        </div>
        <div class="OneLineText">
          <el-popover :content=" data[verifyTitle] " placement="top-start">
            <template #reference>
              <div class="text"> {{ data[verifyTitle] }} </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>

import {numberToAbbr} from '@/app/services/NumberAbbr';
import MShowMore from '@/components/m-show-more.vue';
import IconLightningYellow from '@/assets/image/yellow-lightning.svg';
import IconLightningBlue from '@/assets/image/blue-lightning.svg';

export default {
  'name': 'UpDetail',
  components: { MShowMore },
  props: {
    showBasicNumbers: {type: Boolean, default: true},
    data: {type: Object, default: {}},
    mid: {type: String, default: 'mid'},
    avatar: {type: String, default: 'face'},
    name: {type: String, default: 'name'},
    level: {type: String, default: 'rating_level'},
    activity: {type: String, default: 'activity'},
    fansCount: {type: String, default: 'fans_count'},
    playAvg180: {type: String, default: 'play_avg_180'},
    playTotal180: {type: String, default: 'play_count_180'},
    fans180: {type: String, default: 'fans_180'},
    firstType: {type: String, default: 'first_type_name'},
    secondType: {type: String, default: 'second_type_name'},
    categoryKey: {type: String}, // 在流失池中的特例，分区会返回一个列表
    verifyType: {type: String, default: 'verify_type'},
    verifyTitle: {type: String, default: 'verify_title'},
    qualityScore: {type: String, default: 'quality_score'},
    prScore: {type: String, default: 'pr_score'},
    creditScore: {type: String, default: 'credit_score'},
    toDetailTab: {type: String, default: 'ctrb'},

    placeholder: {type: String, default: null}, // 针对伪UP（并非UP主数据但沿用样式）情况的头像框内的显示方式
    size: {type: String, default: 'middle'},
  },
  data() {
    return {
      IconLightningYellow,
      IconLightningBlue,
      table:false
    };
  },
  computed: {
    fansCountT() {
      let num = this.data[this.fansCount];
      return numberToAbbr(num);
    },
    playAvg180T() {
      return numberToAbbr(this.data[this.playAvg180]);
    },
    convert() {
      let data = this.data;
      if (!data[this.playTotal180]) {
        return '-';
      }
      return (data[this.fans180] / data[this.playTotal180] * 100).toFixed(2) + '%';
    },
    host() {
      return window.location.host;
    },
    pathname() {
      return window.location.pathname;
    },
    category() {
      let cn1,cn2
      if(!this.categoryKey){
        cn1 = this.data[this.firstType];
        cn2 = this.data[this.secondType];
        return [cn1, cn2].filter(x => x).join('-') || '-';
      } else {
        let category = this.data[this.categoryKey];
        let cateGoryInfo = []
        for(let cate of category) {
          cn1 = cate[this.firstType] || '';
          cn2 = cate[this.secondType] || '';
          cateGoryInfo.push(cn1 + (cn1 && cn2 ? '-' : '') + cn2)
        }
        return cateGoryInfo.join('，');
      }
    },
    qualificationT() {
      return ({
        1: 'yellow',
        2: 'yellow',
        7: 'yellow',
        3: 'blue',
        4: 'blue',
        5: 'blue',
        6: 'blue',
      }[this.data[this.verifyType]]);
    },
  },
  methods: {
    avatarBg(data) {
      if (!this.activity) {
        return {
          background: '#E4E4E4',
        };
      }
      return {
        background: ({
          1: 'conic-gradient(yellowgreen,lightgreen, lightgreen, yellowgreen,seagreen,yellowgreen)',
          2: 'conic-gradient(orange,yellow,yellow,yellow,orange,coral,orange)',
          3: 'conic-gradient(orangered,orange,red,red,orangered)',
          4: '#b6b6b6',
        }[data[this.activity]]),
      };
    },
    imgLoad(event) {
      event.target.classList.add('img-loaded');
    },
    imgError(event) {
      event.target.classList.add('img-error');
    },
  },
  mounted(){
  }
};
</script>

<style lang="stylus" scoped>
.column {
  display: flex
  flex-direction: column
  box-sizing border-box
  justify-content: space-between
}

.avatar {
  width: 50px
  height: 50px
  display: block
  border-radius 50%
  box-sizing border-box
  //border: 1px solid #ffffff44
  background-image: url('data:image/gif;base64,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')
  background-size: cover
}

.avatar-img {
  width: 50px
  height: 50px
  display: none
  border-radius 50%
  box-sizing border-box

  &.img-loaded {
    display: block
  }
}

.avatar-outset {
  //border: 2px solid transparent;
  display: flex
  justify-content: center
  align-items: center
  width: 60px
  height: 60px
  border-radius 50%
  position: relative
}

.VerifyIcon {
  display: flex
  align-items: center

  & img {
    width: 16px
    height: 16px
    margin-right: 4px
  }
}


.column--avatar {
  flex-shrink 0
  width: 100px
  justify-content: center
  align-items: center
  margin-right: 20px
}

.column--basic-numbers {
  flex-shrink 0
  width: 100px
}

.column--basic-info {
  //width: 160px
  overflow: hidden
}

.OneLineText {
  position: relative
  cursor pointer
  overflow: hidden

  & .text {
    text-overflow ellipsis
    overflow: hidden
    word-break break-all
    white-space: nowrap
    text-align: center
  }

  & .full-content {
    display: none
    position: fixed
    top: 50vh
    left: 50vw
    transform translate(-50%, -50%)
    background: rgba(255, 255, 255, .9)
    border: 4px solid rgba(0, 0, 0, .1)
    border-image linear-gradient(to right, lightgreen, pink, lightblue) 10 10
    min-width: 300px
    padding: 24px
    z-index: 123123123
    font-weight: bold
    color #222
  }

  &:active {
    //overflow: auto

    & .full-content {
      display: flex
      flex-direction: column
    }
  }
}


.level {
  position: absolute
  color: #fff
  background: dodgerblue
  width: 28px
  height: 28px
  border-radius: 50%
  font-size: 12px
  justify-content: center
  align-items: center
  display: flex
  right: -6px
  top: 0
  transform scale(.6)
  transform-origin 100% 0%
  cursor: pointer
  user-select none
  vertical-align: baseline
}


.UpDetailCard {
  display: flex
  overflow: hidden
  flex-grow 1
  margin: 1px
  padding: 8px
  position: relative

  &.UpDetailCard--middle {
    min-width 360px
  }

  &.UpDetailCard--small {
    flex-grow 0

    .column.column--avatar {
      margin-right: 0
    }
  }

  &.UpDetailCard--mini {
    min-width 360px
    height: 22px
    padding: 0
    flex-grow 0
  }
}

.OuterBorder {
  //border: 2px solid
  //border-image linear-gradient(to right, desaturate(lightblue, 50%), desaturate(yellowgreen, 50%), desaturate(pink, 50%)) 10 10
}

.ListItem {
  display: flex
  justify-content: flex-start
  align-items: center
  height: 24px
  font-size: 14px
}

.number {
  margin-left: 2px
}

.title {
  position: absolute
  z-index: 123
  font-size: 12px
  left: -15px
  top: -10px
  background: darken(#c9c0d3cc, 15)
  color: #f6f7f8
  border: 1px solid #c9c0d3
  padding: 0 4px
  border-radius: 6px
  transform scale(.9)
}

.avatar-placeholder {
  border-radius: 50%;
  background: var(--color-neutral-7);
  width: 60px;
  height: 60px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center
  font-size: 12px
  line-height: 14px
}

</style>

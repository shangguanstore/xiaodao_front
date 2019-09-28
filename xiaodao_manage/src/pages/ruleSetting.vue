<template>
  <div class="rule_setting_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>机构设置</BreadcrumbItem>
        <BreadcrumbItem>规则设置</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container mt20">
      <Tabs value="name1" @on-click="changeTab">
        <TabPane label="机构配置" name="name1">
          <p class="container-sub-title mt20">科目和教室设置</p>
          <Collapse class="mt20" accordion @on-change="changePanel">
            <Panel name="subject">
              科目设置
              <div slot="content">
                <div class="tabBar float-wrap mt10 mb10 ml10">
                  <div class="item fl" :class="subjectTabBar == 0 ? 'active' : ''"
                       @click="changeSubjectTabBar(0)">官方推荐
                  </div>
                  <div class="item fl" :class="subjectTabBar == 1 ? 'active' : ''"
                       @click="changeSubjectTabBar(1)">自定义
                  </div>
                </div>

                <Row v-if="subjectTabBar == 1">
                  <Button type="default" @click="preAddSubject">添加</Button>
                </Row>
                <Row>
                  <Col span="6">
                  <Table border stripe ref="subject" :loading="subjectLoading" :columns="subjectColumns" :data="subjectList"
                         class="mt20"></Table>
                  </Col>
                </Row>

              </div>
            </Panel>

            <Panel name="classroom">
              教室设置
              <div slot="content">
                <Button type="default" @click="preAddClassroom">添加</Button>
                <Row>
                  <Col span="6">
                  <Table border stripe ref="classroom" :loading="classroomLoading" :columns="classroomColumns" :data="classroomList"
                         class="mt20"></Table>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </TabPane>
        <!--<TabPane label="节假日设置" name="name2"></TabPane>-->

        <TabPane label="优惠类目" name="name2">
          <Button type="primary" @click="preAddPromotion">添加</Button>
          <Table border stripe ref="promotion" :loading="promotionLoading" :columns="promotionColumns" :data="promotionList"
                 class="mt20"></Table>
        </TabPane>
      </Tabs>
    </div>

    <Modal
      v-model="promotionModel"
      width:="480"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>新增优惠</span>
      </p>

      <div>
        <Form ref="promotionFormValidate" :model="promotionFormValidate" :rules="promotionRuleValidate" :label-width="80">
          <FormItem label="所属课程" prop="type">
            <RadioGroup v-model="promotionFormValidate.type">
              <Radio :label="config.Promotion.TYPE_DISCOUNT">打折</Radio>
              <Radio :label="config.Promotion.TYPE_CUT_DOWN">减免现金</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="操作数值" prop="num" style="position: relative;margin-bottom: 6px;">
            <Input v-if="promotionFormValidate.type == config.Promotion.TYPE_DISCOUNT" v-model="promotionFormValidate.num" style="width:calc(100% - 60px);"
                   placeholder="请输入0~100的数值" @on-blur="onPromotionNumBlur"></Input>
            <Input v-else v-model="promotionFormValidate.num" style="width:calc(100% - 60px);"
                   placeholder="请输入大于0的数值" @on-blur="onPromotionNumBlur"></Input>
            <span v-if="promotionFormValidate.type == config.Promotion.TYPE_DISCOUNT" class="fieldUnit" style="right: 40px">%</span>
            <span v-else class="fieldUnit" style="right: 40px">元</span>
          </FormItem>

          <FormItem label="优惠名称" prop="name">
            <Input v-model="promotionFormValidate.name" style="width:calc(100% - 60px);"
                   placeholder="输入操作数值自动完成"></Input>
          </FormItem>

        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handlePromotionCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handlePromotionSubmit('promotionFormValidate')">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'ruleSetting',
    data() {
      return {
        config: {},
        subjectLoading: true,
        subjectTabBar: 0,

        promotionList: [],
        promotionColumns: [
          {
            title: '优惠名称',
            key: 'name',
          },
          {
            title: '优惠类型',
            key: 'type_format',
          },
          {
            title: '操作数值',
            key: 'num_format',
          },
          {
            title: '创建时间',
            key: 'create_time_format',
          },
          {
            title: '操作',
            key: 'operation',
            // width:220,
            // fixed:"right",
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    size: 'large',
                    value: params.row.status == config.Promotion.STATUS_OK ? true : false
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    'on-change': () => {
                      this.changePromotionValid(params)
                    }
                  }
                }, [
                  h('span', {
                    slot: 'open',
                    domProps: {
                      innerHTML: '有效'
                    }
                  }),
                  h('span', {
                    slot: 'close',
                    domProps: {
                      innerHTML: '无效'
                    }
                  })
                ]),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#2db7f5',
                    marginLeft: '20px'
                  },
                  on: {
                    click: () => {
                      this.removePromotion(params)
                    }
                  }
                }, '删除'),

              ])
            }
          }
        ],
        promotionLoading: false,
        promotionModel: false,
        promotionFormValidate: {
          type: config.Promotion.TYPE_DISCOUNT,
          num: '',
          name: '',
        },
        promotionRuleValidate: {
          // ccid: [
          //   {required: true, type: 'number', message: '请选择课程', trigger: 'change'}
          // ],
          // name: [{
          //   required: true,
          //   message: '班级名称不能为空',
          //   trigger: 'blur'
          // }],
        },

        classroomLoading: true,
        switch1: true,
        addName: '',
        addTitle: '',

        classroomList: [],
        classroomColumns: [
          {
            title: '教室',
            key: 'name',
          },
          {
            title: '操作',
            key: 'operation',
            // width:220,
            // fixed:"right",
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    size: 'large',
                    value: params.row.status == config.ClassRoom.STATUS_OK ? true : false
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    'on-change': () => {
                      this.changeClassRoomValid(params)
                    }
                  }
                }, [
                  h('span', {
                    slot: 'open',
                    domProps: {
                      innerHTML: '有效'
                    }
                  }),
                  h('span', {
                    slot: 'close',
                    domProps: {
                      innerHTML: '无效'
                    }
                  })
                ]),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#2db7f5',
                    marginLeft: '20px'
                  },
                  on: {
                    click: () => {
                      this.removeClassroom(params)
                    }
                  }
                }, '删除'),

              ])
            }
          }
        ],

        subjectList: [],
        subjectColumns: [
          {
            title: '学科',
            key: 'name',
          },
          {
            title: '操作',
            key: 'operation',
            // width:220,
            // fixed:"right",
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    size: 'large',
                    value: params.row.status == config.Subject.STATUS_OK ? true : false
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    'on-change': () => {
                      this.changeSubjectValid(params)
                    }
                  }
                }, [
                  h('span', {
                    slot: 'open',
                    domProps: {
                      innerHTML: '有效'
                    }
                  }),
                  h('span', {
                    slot: 'close',
                    domProps: {
                      innerHTML: '无效'
                    }
                  })
                ]),
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small'
                //   },
                //   style: {
                //     color: '#2db7f5',
                //     marginLeft: '20px'
                //   },
                //   on: {
                //     click: () => {
                //       this.removeSubject(params)
                //     }
                //   }
                // }, '删除'),

              ])
            }
          }
        ]
      }
    },
    mounted() {

    },
    created() {
      this.config = config
    },
    methods: {
      onPromotionNumBlur() {
        let val = this.promotionFormValidate.num
        if(this.promotionFormValidate.type == config.Promotion.TYPE_DISCOUNT) {
          var discount = val / 10
          this.promotionFormValidate.name = `打${discount}折`
        }else if(this.promotionFormValidate.type == config.Promotion.TYPE_CUT_DOWN){
          this.promotionFormValidate.name = `减${val}元`
        }
      },
      changeTab(e) {
        if(e == 'name2') {
          this.getPromotionList()
        }
      },
      preAddPromotion() {
        this.promotionModel = true
        this.promotionFormValidate.num = ''
        this.promotionFormValidate.name = ''
      },
      changePanel(e) {
        if(lib.in_array('subject',e) && this.subjectList.length == 0) {
          this.getSubjectList()
        }else if(lib.in_array('classroom',e) && this.classroomList.length == 0) {
          this.getClassroomList()
        }
      },

      preAddRender (callback) {
        this.addName = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('p', {
                style: {
                  textAlign: 'left',
                  fontSize: '16px',
                  marginBottom: '20px'
                },
              },this.addTitle),
              h('Input', {
                props: {
                  value: this.value,
                  autofocus: true,
                  placeholder: '请输入'
                },
                on: {
                  input: (val) => {
                    this.addName = val;
                  },
                }
              }),
            ])
          },
          onOk: () => {
            this[callback]()
          }
        })
      },


      //教室
      getClassroomList() {
        this.classroomLoading = true
        let submitData = {
        }
        let url = lib.getRequestUrl('/api/classroom/my', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            console.log('res==',res)
            this.classroomLoading = false
            this.classroomList = res.data.data
          }
        }).catch(error => {
          console.log('error', error)
          this.classroomLoading = false
          this.$Message.error(error.message);
        })
      },
      preAddClassroom() {
        this.addTitle = '添加教室'
        this.preAddRender('addClassroom')
      },
      addClassroom() {
        let submitData = {
          name: this.addName
        }
        let url = "/api/classroom/add"
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('添加教室成功!')
            this.getClassroomList()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      changeClassRoomValid(params) {
        let newStatus = params.row.status == config.ClassRoom.STATUS_OK ? config.ClassRoom.STATUS_INVALID : config.ClassRoom.STATUS_OK

        let submitData = {
          id: params.row.id,
          status: newStatus
        }
        let url = "/api/classroom/update"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('更新状态成功！')
          this.getClassroomList()
        }).catch(error => {
          this.getClassroomList()
          this.$Message.error(error.message)
        })
      },
      removeClassroom(params) {
        let submitData = {
          id: params.row.id
        }
        let url = "/api/classroom/del"
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('删除教室成功!')
            this.getClassroomList()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },


      //学科
      changeSubjectTabBar(index) {
        this.subjectTabBar = index
        if(index == 0) {
          this.subjectColumns = [
            {
              title: '学科',
              key: 'name',
            },
            {
              title: '操作',
              key: 'operation',
              // width:220,
              // fixed:"right",
              render: (h, params) => {
                return h('div', [
                  h('i-switch', {
                    props: {
                      size: 'large',
                      value: params.row.status == config.Subject.STATUS_OK ? true : false
                    },
                    style: {
                      color: '#2db7f5'
                    },
                    on: {
                      'on-change': () => {
                        this.changeSubjectValid(params)
                      }
                    }
                  }, [
                    h('span', {
                      slot: 'open',
                      domProps: {
                        innerHTML: '有效'
                      }
                    }),
                    h('span', {
                      slot: 'close',
                      domProps: {
                        innerHTML: '无效'
                      }
                    })
                  ]),
                  // h('Button', {
                  //   props: {
                  //     type: 'text',
                  //     size: 'small'
                  //   },
                  //   style: {
                  //     color: '#2db7f5',
                  //     marginLeft: '20px'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.removeSubject(params)
                  //     }
                  //   }
                  // }, '删除'),

                ])
              }
            }
          ]
        }else{
          this.subjectColumns = [
            {
              title: '学科',
              key: 'name',
            },
            {
              title: '操作',
              key: 'operation',
              // width:220,
              // fixed:"right",
              render: (h, params) => {
                return h('div', [
                  h('i-switch', {
                    props: {
                      size: 'large',
                      value: params.row.status == config.Subject.STATUS_OK ? true : false
                    },
                    style: {
                      color: '#2db7f5'
                    },
                    on: {
                      'on-change': () => {
                        this.changeSubjectValid(params)
                      }
                    }
                  }, [
                    h('span', {
                      slot: 'open',
                      domProps: {
                        innerHTML: '有效'
                      }
                    }),
                    h('span', {
                      slot: 'close',
                      domProps: {
                        innerHTML: '无效'
                      }
                    })
                  ]),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#2db7f5',
                      marginLeft: '20px'
                    },
                    on: {
                      click: () => {
                        this.removeSubject(params)
                      }
                    }
                  }, '删除'),

                ])
              }
            }
          ]
        }


        this.getSubjectList()
      },
      getSubjectList() {
        this.subjectLoading = true
        let submitData = {
          type: this.subjectTabBar == 0 ? config.Subject.TYPE_SYS_DETAULT : config.Subject.TYPE_CUSTOM
        }
        let url = lib.getRequestUrl('/api/subject/list', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.subjectLoading = false
            this.subjectList = res.data.data
          }
        }).catch(error => {
          console.log('error', error)
          this.subjectLoading = false
          this.$Message.error(error.message);
        })
      },
      preAddSubject() {
        this.addTitle = '添加科目'
        this.preAddRender('addSubject')
      },
      addSubject() {
        let submitData = {
          name: this.addName
        }
        let url = "/api/subject/add"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('添加成功!')
          this.getSubjectList()
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      changeSubjectValid(params) {
        let newStatus = params.row.status == config.Subject.STATUS_OK ? config.Subject.STATUS_INVALID : config.Subject.STATUS_OK

        let submitData = {
          id: params.row.id,
          status: newStatus
        }
        let url = "/api/subject/update"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('更新状态成功！')
          this.getSubjectList()
        }).catch(error => {
          this.getSubjectList()
          this.$Message.error(error.message)
        })
      },
      removeSubject(params) {
        let submitData = {
          id: params.row.id
        }
        let url = "/api/subject/del"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('删除成功!')
          this.getSubjectList()
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },

      //优惠券信息
      getPromotionList() {
        this.promotionLoading = true
        let submitData = {
          status: [config.Promotion.STATUS_OK, config.Promotion.STATUS_INVALID]
        }
        let url = '/api/promotion/getlist'
        this.$http.post(url, submitData).then(res => {
          this.promotionLoading = false
          this.promotionList = res.data.data
          this.promotionList = lib.filterResult(this.promotionList)
          this.promotionList.map(item=>{
            if(item.type == config.Promotion.TYPE_DISCOUNT) {
              item.type_format = '打折'
              item.num_format = `${item.num}%`
            }else if(item.type == config.Promotion.TYPE_CUT_DOWN) {
              item.type_format = '减免现金'
              item.num_format = item.num
            }
          })
        }).catch(error => {
          this.promotionLoading = false
          this.$Message.error(error.message);
        })
      },
      handlePromotionSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            let url = '/api/promotion/add'

            let submitData = {
              name: this.promotionFormValidate.name,
              num: this.promotionFormValidate.num,
              type: this.promotionFormValidate.type
            }
            this.$http.post(url, submitData).then(res => {
              this.$Message.success('添加成功')
              this.promotionModel = false
              this.getPromotionList()
            }).catch(error => {
              this.$Message.error('添加失败，' + error.message)
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handlePromotionCancel() {
        this.promotionModel = false
      },

      changePromotionValid(params) {
        let newStatus = params.row.status == config.Promotion.STATUS_OK ? config.Promotion.STATUS_INVALID : config.Promotion.STATUS_OK

        let submitData = {
          id: params.row.id,
          status: newStatus
        }
        let url = "/api/promotion/update"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('更新状态成功！')
          this.getPromotionList()
        }).catch(error => {
          this.getPromotionList()
          this.$Message.error(error.message)
        })
      },
      removePromotion(params) {
        let submitData = {
          id: params.row.id
        }
        let url = "/api/promotion/del"
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('删除成功!')
            this.getPromotionList()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },

    }
  }
</script>

<style>
  .rule_setting_container ul.office-subject {
    width: 40%;
    border-left: solid 1px rgba(235, 235, 235, 1);
    border-right: solid 1px rgba(235, 235, 235, 1);
  }

  .rule_setting_container ul.office-subject li {
    display: flex;
    justify-content: space-between;
    border-top: solid 1px rgba(235, 235, 235, 1);
    padding: 10px 20px;
  }

  .rule_setting_container ul.office-subject li:last-child {
    border-bottom: solid 1px rgba(235, 235, 235, 1);
  }

</style>

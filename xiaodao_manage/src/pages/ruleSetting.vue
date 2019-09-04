<template>
  <div class="rule_setting_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>机构设置</BreadcrumbItem>
        <BreadcrumbItem>规则设置</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container mt20">
      <Tabs value="name1">
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


            <!--<Panel name="3">-->
              <!--乔纳森·伊夫-->
              <!--<p slot="content">-->
                <!--乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>-->
            <!--</Panel>-->
          </Collapse>
        </TabPane>
        <!--<TabPane label="节假日设置" name="name2"></TabPane>-->
        <TabPane label="" name="name2"></TabPane>
      </Tabs>
    </div>

  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'ruleSetting',
    data() {
      return {
        subjectLoading: true,
        subjectTabBar: 0,

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

    },
    methods: {
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

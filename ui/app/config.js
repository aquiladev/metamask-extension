const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('./actions')
const Select = require('react-select')

module.exports = connect(mapStateToProps)(ConfigScreen)

function mapStateToProps (state) {
  return {
    metamask: state.metamask,
  }
}

inherits(ConfigScreen, Component)
function ConfigScreen () {
  Component.call(this)
}

ConfigScreen.prototype.render = function () {
  var state = this.props
  var metamaskState = state.metamask

  return (
    h('.flex-column.flex-grow', [

      // subtitle and nav
      h('.section-title.flex-row.flex-center', [
        h('i.fa.fa-arrow-left.fa-lg.cursor-pointer', {
          onClick: (event) => {
            state.dispatch(actions.goHome())
          },
        }),
        h('h2.page-subtitle', 'Configuration'),
      ]),

      // conf view
      h('.flex-column.flex-justify-center.flex-grow.select-none', [
        h('.flex-space-around', {
          style: {
            padding: '20px',
          },
        }, [

          currentProviderDisplay(metamaskState),

          h('div', { style: {display: 'flex'} }, [
            h('input#new_rpc', {
              placeholder: 'New RPC URL',
              style: {
                width: 'inherit',
                flex: '1 0 auto',
                height: '30px',
                margin: '8px',
              },
              onKeyPress (event) {
                if (event.key === 'Enter') {
                  var element = event.target
                  var newRpc = element.value
                  state.dispatch(actions.setRpcTarget(newRpc))
                }
              },
            }),
            h('button', {
              style: {
                alignSelf: 'center',
              },
              onClick (event) {
                event.preventDefault()
                var element = document.querySelector('input#new_rpc')
                var newRpc = element.value
                state.dispatch(actions.setRpcTarget(newRpc))
              },
            }, 'Save'),
          ]),
          h('hr.horizontal-line'),
          currentConversionInformation(metamaskState, state),
          h('hr.horizontal-line'),

          h('div', {
            style: {
              marginTop: '20px',
            },
          }, [
            h('button', {
              style: {
                alignSelf: 'center',
              },
              onClick (event) {
                event.preventDefault()
                state.dispatch(actions.revealSeedConfirmation())
              },
            }, 'Reveal Seed Words'),
          ]),

        ]),
      ]),
    ])
  )
}

function currentConversionInformation (metamaskState, state) {
  var currentFiat = metamaskState.currentFiat
  return h('div'), [
    h('span', {style: { fontWeight: 'bold', paddingRight: '10px'}}, "Current Fiat"),
    h('select#currentFiat', {
      onChange (event) {
        event.preventDefault()
        var element = document.getElementById("currentFiat")
        var newFiat = element.value
        state.dispatch(actions.setCurrentFiat(newFiat))
      },
      value: currentFiat,
      defaultValue: currentFiat,
    }, [
      h('option', {key: 'USD', value: 'USD'}, 'USD'),
      h('option', {key: 'EUR', value: 'EUR'}, 'EUR'),
      h('option', {key: 'JPY', value: 'JPY'}, 'JPY'),
    ]
  ),
  ]
}

function currentProviderDisplay (metamaskState) {
  var provider = metamaskState.provider
  var title, value

  switch (provider.type) {

    case 'mainnet':
      title = 'Current Network'
      value = 'Main Ethereum Network'
      break

    case 'testnet':
      title = 'Current Network'
      value = 'Morden Test Network'
      break

    default:
      title = 'Current RPC'
      value = metamaskState.provider.rpcTarget
  }

  return h('div', [
    h('span', {style: { fontWeight: 'bold', paddingRight: '10px'}}, title),
    h('span', value),
  ])
}

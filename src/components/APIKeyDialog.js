import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, Dialog, IconButton, Portal, ProgressBar, Text, TextInput } from 'react-native-paper'

const APIKeyDialog = forwardRef((props, ref) => {
    const [APIKey, setAPIKey] = useState('')
    const [visible, setVisible] = useState(false)
    const [testing, setTesting] = useState(false)
    const [error, setError] = useState(false)
    const [warning, setWarning] = useState(false)
    const [succ, setSucc] = useState(false)

    useImperativeHandle(ref, () => ({ showDialog, hideDialog }))

    useEffect(() => {
        setAPIKey(props.APIKey)
    }, [props.APIKey])

    const showDialog = () => {
        setVisible(true)
        setWarning(false)
        setError(false)
        setTesting(false)
    }
    const hideDialog = () => setVisible(false)

    const renderTestAPIKey = () => {
        if (testing) {
            return (
                <>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Testing your API key ...</Text>
                    </Dialog.Content>
                    <Dialog.Content>
                        <ProgressBar indeterminate={true} />
                    </Dialog.Content>
                </>
            )
        }
    }

    const renderWarning = () => {
        if (warning) {
            return (
                <>
                    <Dialog.Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                            icon="alert-circle"
                            iconColor="red"
                        />
                        <Text style={{ color: 'red' }} variant="bodyMedium">Key is invalid</Text>
                    </Dialog.Content>
                </>
            )
        }
    }

    const renderSucc = () => {
        if (succ) {
            return (
                <>
                    <Dialog.Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        icon="check-circle"
                        iconColor="green"
                    /><Text style={{ color: 'green' }} variant="bodyMedium">Key is valid</Text>
                    </Dialog.Content>
                </>
            )
        }
    }

    const renderError = () => {
        if (error) {
            return (
                <>
                    <Dialog.Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        icon="alert-circle"
                        iconColor="red"
                    /><Text style={{ color: 'red' }} variant="bodyMedium">Network error</Text>
                    </Dialog.Content>
                </>
            )
        }
    }

    const handleChangeText = (_text) => {
        setAPIKey(_text)
        testKey(_text)
    }

    const handlePressDone = () => {
        props.onSubmitKey(APIKey)
        hideDialog()
    }

    const testKey = (APIKey) => {
        setSucc(false)
        setWarning(false)
        setError(false)
        setTesting(true)
        fetch('https://API.openai.com/v1/engines', {
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + APIKey,
            }
        })
            .then((res) => {
                if (res.status) {
                    if (res.status === 401) {
                        setWarning(true)
                    }
                    else if (res.status === 200) {
                        setSucc(true)
                    }
                }
                else {
                    throw res
                }
                setTesting(false)
            })
            .catch((err) => {
                console.log(err)
                setError(true)
                setTesting(false)
            })
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Set API Key</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Input your API key here</Text>
                </Dialog.Content>
                <Dialog.Content>
                    <TextInput
                        value={APIKey}
                        mode="outlined"
                        label="API Key"
                        placeholder="Type your API key here"
                        onChangeText={(_text) => handleChangeText(_text)}
                    />
                </Dialog.Content>
                {renderTestAPIKey()}
                {renderWarning()}
                {renderSucc()}
                {renderError()}
                <Dialog.Actions>
                    <Button onPress={() => testKey(APIKey)} disabled={testing}>Test</Button>
                    <Button onPress={handlePressDone} disabled={!succ}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
})

export default APIKeyDialog;

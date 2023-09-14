import pynecone as pc
from pynecone.base import Base
from datetime import datetime

from helper_bot.ai import ai_request

class Message(Base):
    text: str
    created_at: str
    type: str # 'user' | 'bot'

class State(pc.State):
    messages: list[Message] = []

    async def handle_submit(self, form_data: dict):
        def addMessage(text, type):
            self.messages = self.messages + [
                Message(
                    text=text,
                    type=type,
                    created_at=datetime.now().strftime("%B %d, %Y %I:%M %p"),
                )
            ]

        message = form_data["message"]
        if not message.strip():
            return

        addMessage(text=message, type="user")
        res_message = await ai_request(message=message)
        addMessage(text=res_message, type="bot")
    pass

def message(message: Message):
    print(message.type, message.text)

    if(message.type == 'bot'):
        return pc.box(
            pc.text(message.text),
            display="inline_flex",
            font_size="14px",
            background_color="#f5f5f5",
            padding="0.5rem",
            border_radius="8px",
        )

    return pc.box(
        pc.text(message.text),
        align_self="end",
        display="inline_flex",
        font_size="14px",
        color="#fff",
        background_color="#3B82F6",
        padding="0.5rem",
        border_radius="8px",
    )

def index() -> pc.Component:
    return pc.fragment(
        pc.color_mode_button(pc.color_mode_icon(), float="right"),
        pc.vstack(
            pc.heading("개발자 도우미", font_size="1em", font_weight="bold"),
            pc.vstack(
                pc.foreach(State.messages, message),
                margin="2rem 0",
                spacing="1rem",
                align_items="start",
                width="100%",
                height="100%",
                overflow_y="auto",
            ),
            pc.form(
                pc.hstack(
                    pc.input(
                        id="message",
                        placeholder="질문을 입력해주세요.",
                        border_color="#eaeaef",
                        width="100%",
                    ),
                    pc.button(
                        "묻기",
                        type_="submit",
                    ),
                    display="flex",
                    align_items="center",
                    margin_top="auto",
                ),
                on_submit=State.handle_submit,
                width="100%",
            ),
            spacing="1.5em",
            font_size="2em",
            padding="10%",
            margin="0 auto",
            max_width="600px",
            height="100vh"
        ),
    )

# Add state and page to the app.
app = pc.App(
    state=State, 
    style={
    }
)
app.add_page(index)
app.compile()

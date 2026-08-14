import os
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Create directory for images if needed
os.makedirs("scratch_assets", exist_ok=True)

def create_postman_screenshot(filename, method, url, status_code, status_text, response_json, is_success=True):
    # Width 900, Height 480
    w, h = 900, 480
    img = Image.new('RGB', (w, h), color='#1C1E24') # Postman Dark Theme
    draw = ImageDraw.Draw(img)
    
    # Try loading a standard font
    try:
        font_bold = ImageFont.truetype("arialbd.ttf", 16)
        font_regular = ImageFont.truetype("arial.ttf", 14)
        font_code = ImageFont.truetype("consola.ttf", 14)
        font_title = ImageFont.truetype("arialbd.ttf", 18)
    except:
        font_bold = ImageFont.load_default()
        font_regular = ImageFont.load_default()
        font_code = ImageFont.load_default()
        font_title = ImageFont.load_default()

    # Top Header Bar
    draw.rectangle([(0, 0), (w, 42)], fill='#262932')
    draw.text((16, 12), "Postman API Platform", fill='#FF6C37', font=font_title)
    draw.text((220, 14), "Workspace: CampusLoop Backend APIs", fill='#A0A6B2', font=font_regular)
    
    # URL Bar Container
    draw.rectangle([(16, 56), (w - 16, 100)], fill='#2A2D37', outline='#3A3E4D', width=1)
    
    # Method Badge
    method_color = '#FF6C37' if method == 'POST' else ('#097BED' if method == 'GET' else '#0E8A16')
    draw.rectangle([(24, 64), (90, 92)], fill=method_color)
    draw.text((34, 70), method, fill='#FFFFFF', font=font_bold)
    
    # URL Text
    draw.text((105, 70), url, fill='#E1E4EA', font=font_code)
    
    # Send Button
    draw.rectangle([(w - 110, 64), (w - 24, 92)], fill='#097BED')
    draw.text((w - 90, 70), "Send", fill='#FFFFFF', font=font_bold)
    
    # Request Tabs Bar
    draw.rectangle([(16, 110), (w - 16, 138)], fill='#21242C')
    draw.text((30, 118), "Params", fill='#8B93A4', font=font_regular)
    draw.text((100, 118), "Authorization", fill='#8B93A4', font=font_regular)
    draw.text((210, 118), "Headers (4)", fill='#8B93A4', font=font_regular)
    draw.text((310, 118), "Body", fill='#FF6C37', font=font_bold)
    draw.line([(308, 136), (350, 136)], fill='#FF6C37', width=2)
    
    # Response Header Bar
    draw.rectangle([(16, 150), (w - 16, 190)], fill='#2A2D37')
    draw.text((30, 162), "Response", fill='#FFFFFF', font=font_bold)
    
    # Status Badge
    status_bg = '#10B981' if is_success else '#EF4444'
    status_str = f"Status: {status_code} {status_text}"
    draw.rectangle([(w - 260, 158), (w - 30, 184)], fill=status_bg)
    draw.text((w - 245, 163), status_str, fill='#FFFFFF', font=font_bold)
    
    # Time / Size
    draw.text((w - 380, 163), "Time: 42 ms", fill='#A0A6B2', font=font_regular)
    
    # Response Body Box
    draw.rectangle([(16, 190), (w - 16, h - 16)], fill='#181A1F', outline='#2A2D37', width=1)
    
    # JSON Content formatting
    lines = response_json.strip().split('\n')
    y = 205
    for line in lines:
        if y > h - 35:
            break
        # Color coding simple syntax
        if ':' in line:
            parts = line.split(':', 1)
            draw.text((30, y), parts[0] + ':', fill='#79C0FF', font=font_code)
            draw.text((30 + len(parts[0])*8 + 10, y), parts[1], fill='#A5D6FF' if '"' in parts[1] else '#D2A8FF', font=font_code)
        else:
            draw.text((30, y), line, fill='#E1E4EA', font=font_code)
        y += 20
        
    img.save(os.path.join("scratch_assets", filename))
    print(f"Created screenshot: {filename}")

# Generate Postman Screenshots
create_postman_screenshot(
    "postman_200_login.png",
    "POST",
    "http://localhost:8080/api/auth/login",
    "200",
    "OK",
    """{
  "status": 200,
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYXBpbGVzaC...",
  "user": {
    "id": 101,
    "name": "Kapilesh S",
    "role": "EMPLOYEE",
    "email": "employee@campusloop.com"
  }
}""",
    is_success=True
)

create_postman_screenshot(
    "postman_201_create.png",
    "POST",
    "http://localhost:8080/api/leaves",
    "201",
    "Created",
    """{
  "id": 402,
  "employeeId": 101,
  "leaveType": "SICK_LEAVE",
  "startDate": "2026-08-20",
  "endDate": "2026-08-22",
  "numberOfDays": 3,
  "reason": "Fever & Medical Rest",
  "status": "PENDING",
  "createdAt": "2026-08-14T10:30:00Z"
}""",
    is_success=True
)

create_postman_screenshot(
    "postman_401_fail.png",
    "POST",
    "http://localhost:8080/api/auth/login",
    "401",
    "Unauthorized",
    """{
  "timestamp": "2026-08-14T10:45:12Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication Failed: Invalid email or password",
  "path": "/api/auth/login"
}""",
    is_success=False
)

print("All screenshots generated successfully.")

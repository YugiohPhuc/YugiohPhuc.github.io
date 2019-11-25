SmartCar(Ver2)
-----

*edit: 
- dùng http put để lấy distance
- đã thay giao diện bên ngoài
- đã xóa hết râu ria (comment), chỉ dùng trilateration để tính toán
- thay file db, db giờ chỉ còn 4 table cần thiết (beacon, user, map, distance_collect)
- đã thay map mới vào (nhưng mà là dùng cách thủ công: đổi tất cả cái đường dẫn /access/public/map/map trong file canvas.ejs --> /access/public/map/map2 và thêm ảnh map2 vào thư mục chứa ảnh /access/public/map )
- ghi chú công dụng những file cần thiết
- dùng angular ajax để liên tục cập nhật được tọa độ và dùng canvas để vẽ lên map (đã vẽ theo trục tọa độ nằm ở góc trái bên dưới)
- có vẽ đc thêm 3 con beacon lên map
- gộp vào chung 1 luồng
- thêm tab "Điều khiển bằng server với các chức năng: nhập tọa độ điểm cần đến, chọn mode, điều khiển xe (Start, Stop)
- tọa độ vẽ trên map được làm tròn đến 2 chữ số hàng thập phân, còn tọa độ trả về thì làm tròn đến 1 chữ số hàng thập phân
- bỏ rssi, chỉ nhận lên distance và tính ra tọa độ



*completed:
- dùng http put để lấy distance và update được vào db 
- chỉ cần dùng trilateration là đã lấy được tọa độ
- đã định vị được trên map dùng ajax
- device chỉ cần gửi 1 req có distance lên



Link driver để file chứa ảnh (chỉ cần down về bỏ chung thư mục với các file code):
https://drive.google.com/drive/u/2/folders/1hmzKTUxbnxPqVi3cXS1XfKyVUcpi1pno



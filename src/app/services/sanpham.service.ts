import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SanPham } from '../models/sanpham';
import { FormControl, FormGroup } from '@angular/forms';
import { UserForm } from '../models/userform';
import { GioHang } from '../models/giohang';
import { GioHangSanPham } from '../models/giohangsanpham';
import { HoaDon } from '../models/hoadon';
import { CTHoaDon } from '../models/cthoadon';
import { SanPhamKho } from '../models/sanphamkho';
import { Kho } from '../models/kho';
import { SanPhamSize } from '../models/sanphamsize';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Code } from '../models/code';
import { LSDuyet } from '../models/lsduyet';
import { Voucher } from '../models/voucher';

interface ProductCodeResponse {
    productCode: string;
}
@Injectable({
    providedIn: 'root'
})

export class SanPhamService {
    private searchQuery = new BehaviorSubject<string>('');
    currentSearchQuery = this.searchQuery.asObservable();
    optionsUpdated = new Subject<{array0: any[], array1: any[], array2: any[],array3: any[] }>();
    private userEmail: string = '';
    private userRole: string = '';
    private userRoleKey: string = '';
    private userEmailKey : string = '';
    private reloadHeaderSource = new Subject<void>();
    reloadHeader$ = this.reloadHeaderSource.asObservable();

    private userPayload:any;

    private baseUrlLocationVN = 'https://localhost:7035/api/Locations';

    constructor(private httpClient: HttpClient, private router: Router){
        this.userPayload = this.decodedToken();
    }

    triggerReload() {
        this.reloadHeaderSource.next();
    }

    // Lấy danh sách Tỉnh/Thành phố
    getProvinces(): Observable<any> {
        return this.httpClient.get(`${this.baseUrlLocationVN}/provinces`);
    }

    // Lấy danh sách Quận/Huyện theo Tỉnh/Thành phố
    getDistricts(provinceCode: string): Observable<any> {
        return this.httpClient.get(`${this.baseUrlLocationVN}/districts/${provinceCode}`);
    }

    // Lấy danh sách Phường/Xã theo Quận/Huyện
    getWards(districtCode: string): Observable<any> {
        return this.httpClient.get(`${this.baseUrlLocationVN}/wards/${districtCode}`);
    }

    getLocation(tp: string,qh :string,px: string): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/Locations/ProvincesAndDistrictAndWard/"+tp+"/"+qh+"/"+px);
    }
    
    getSanPhams(){
        return this.httpClient.get<SanPham[]>("https://localhost:7035/api/SanPhams/Get");
    }
    /*getSanPhamKhos(){
        return this.httpClient.get<SanPhamKho[]>("https://localhost:7035/api/SanPhams/GetSanPhamWithSoLuong");
    }*/
    getSanPhamKhos(page: number, pageSize: number): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/SanPhams/GetSanPhamWithSoLuong/"+page+"/"+pageSize);
    }
    getNewMaSP(): Observable<ProductCodeResponse>{
        return this.httpClient.get<ProductCodeResponse>("https://localhost:7035/api/SanPhams/GenerateProductCode");
    }
    addProduct(productRequest: SanPham): Observable<SanPham>{
        return this.httpClient.post<SanPham>("https://localhost:7035/api/SanPhams/Insert", productRequest);
    }
    addSanPhamKho(khoRequest: Kho): Observable<Kho>{
        return this.httpClient.post<Kho>("https://localhost:7035/api/Khos/Insert", khoRequest);
    }
    uploadImage(formData: any) {
        return this.httpClient.post("https://localhost:7035/api/SanPhams/UploadImage2", formData);
    }
    uploadFile(val:any) {
        return this.httpClient.post("https://localhost:7035/api/SanPhams/UploadFile", val);
    }
    loadImage(){
        return this.httpClient.get<any[]>("https://localhost:7035/api/SanPhams/GetAllImagePaths");
    }
    getSanPhamsByTenSP(tenSP: string){
        return this.httpClient.get<SanPham[]>("https://localhost:7035/api/SanPhams/GetByPartialTenSP/partial/" + tenSP);
    }
    getSanPhamsByTenSPKho(tenSP: string,page: number, pageSize: number){
        return this.httpClient.get<any>("https://localhost:7035/api/SanPhams/GetSanPhamWithTotalQuantity/" + tenSP +"/"+page+"/"+pageSize + "/withTotalQuantity");
    } 
    updateSearchQuery(query: string) {
        this.searchQuery.next(query);
    }
    getProducts(trangThai: string[],kieuDang: string[], gia: string[],chatLieu: string[],page: number, pageSize: number): Observable<any> {
        let params = new HttpParams();

        trangThai.forEach(trangThai => {
            params = params.append('trangThai', trangThai);
          });
        kieuDang.forEach(kieuDang => {
            params = params.append('kieuDang', kieuDang);
        });
        gia.forEach(gia => {
          params = params.append('gia', gia);
        });
        chatLieu.forEach(chatLieu => {
            params = params.append('chatLieu', chatLieu);
        });
        params = params.append('page',page);
        params = params.append('pageSize',pageSize);
        return this.httpClient.get<SanPhamKho[]>("https://localhost:7035/api/SanPhams/GetByPriceAndMaterial", { params: params });
    }
    getProductsURLtinhTrang(trangThai: string,page: number, pageSize: number){
        return this.httpClient.get<any>("https://localhost:7035/api/SanPhams/GetSanPhamTrangThaiWithTotalQuantity/" + trangThai +"/"+page+"/"+pageSize + "/withTotalQuantity");
    } 
    getProductsURLgioiTinh(gioiTinh: string,page: number, pageSize: number){
        return this.httpClient.get<any>("https://localhost:7035/api/SanPhams/GetSanPhamGioiTinhWithTotalQuantity/" + gioiTinh +"/"+page+"/"+pageSize + "/withTotalQuantity");
    } 

    deleteProduct(maSP: string):  Observable<SanPham> {
        return this.httpClient.delete<SanPham>("https://localhost:7035/api/SanPhams/Delete/" + maSP);
    }
    deleteProductKho(maSP: string):  Observable<Kho> {
        return this.httpClient.delete<Kho>("https://localhost:7035/api/Khos/DeleteKhoByMaSP/" + maSP);
    }
    getProduct(maSP: string): Observable<SanPham>{
        return this.httpClient.get<SanPham>("https://localhost:7035/api/SanPhams/Get/" + maSP);
    }
    getProductSize(maSP: string): Observable<SanPhamSize>{
        return this.httpClient.get<SanPhamSize>("https://localhost:7035/api/SanPhams/GetSanPhamWithSizeQuantity/" + maSP + "/withSizeQuantity");
    }
    
    updatepProduct(updateProductRequest: SanPham):  Observable<SanPham>{
        return this.httpClient.put<SanPham>("https://localhost:7035/api/SanPhams/Update", updateProductRequest);
    }

    public validateAllFormFileds(formGroup:FormGroup){
        Object.keys(formGroup.controls).forEach(field=>{
          const control = formGroup.get(field);
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf:true});
          }else if (control instanceof FormGroup){
            this.validateAllFormFileds(control)
          }
        })
    }

    // auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth 

    login(loginRequest: any){
        loginRequest.name= '';
        loginRequest.user_type = '';
        return this.httpClient.post<any>("https://localhost:7035/api/UserForms/Login", loginRequest);
    }
    updatePass(updateRequest: UserForm):  Observable<UserForm>{
        return this.httpClient.put<UserForm>("https://localhost:7035/api/UserForms/Update", updateRequest);
    }
    setLoggedIn(email: string, role: string) {
        localStorage.setItem(this.userEmailKey, email);
        localStorage.setItem(this.userRoleKey, role);
    }

    setLoggedInEmail(email: string){
        localStorage.setItem(this.userEmailKey, email);
    }
    
    setLoggedInRole(role: string){
        localStorage.setItem(this.userRoleKey, role);
    }

    // Lấy userRole từ LocalStorage
    get userRoleLoggedIn(): string {
        return localStorage.getItem(this.userRoleKey) || '';
    }

    // Đặt userRole vào LocalStorage
    

    // Xóa userRole khỏi LocalStorage
    clearUserRole() {
        localStorage.removeItem(this.userRoleKey);
    }

    // Lấy userEmail từ LocalStorage
    get userEmailLoggedIn(): string {
        return localStorage.getItem(this.userEmailKey) || '';
    }

    // Đặt userEmail vào LocalStorage
    

    // Xóa userEmail khỏi LocalStorage
    clearUserEmail() {
        localStorage.removeItem(this.userEmailKey);
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['home']).then(() => {
            window.location.reload();
          });
    }
    storeToken(tokenValue: string){
        localStorage.setItem('token', tokenValue)
    }
    getToken(){
        return localStorage.getItem('token')
    }
    isLoggedIn(): boolean{
        return !!localStorage.getItem('token')
    }
    
    decodedToken(){
        const jwtHelper = new JwtHelperService();
        const token = this.getToken()!;
        return jwtHelper.decodeToken(token)
    }
    
    getfullNameFromToken(){
        if(this.userPayload)
        return this.userPayload.unique_name;
    }
    
    getRoleFromToken(){
        if(this.userPayload)
        return this.userPayload.role;
    }
    
    getEmailFromToken(){
        if(this.userPayload)
        return this.userPayload.email;
    }
    
    hasRoles(requiredRoles: string[]): boolean {
        const userRoles = this.getRoleFromToken(); // Lấy các vai trò của người dùng từ token
        // Kiểm tra xem người dùng có tất cả các quyền cần thiết hay không
        return requiredRoles.every(role => userRoles.includes(role));
    }

    // auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth auth

    signUp(usertRequest: UserForm): Observable<UserForm>{
        return this.httpClient.post<UserForm>("https://localhost:7035/api/UserForms/Insert", usertRequest);
    }
    addGioHang(gioHangRequest: GioHang): Observable<GioHang>{
        return this.httpClient.post<GioHang>("https://localhost:7035/api/GioHangs/Insert", gioHangRequest);
    }
    getID(email:string) : Observable<number>{
        return this.httpClient.get<number>("https://localhost:7035/api/UserForms/Get/"+email);
    }
    getRoleUser(email: string): Observable<UserForm>{
        return this.httpClient.get<UserForm>("https://localhost:7035/api/UserForms/GetRole/" + email);
    }
    getSizesByProduct(maSP: string): Observable<number[]> {
        return this.httpClient.get<number[]>("https://localhost:7035/api/Khos/GetSizesByProduct/"+maSP);
    }
    getQuantityByProductAndSize(maSP: string, maSize: number): Observable<number> {
        return this.httpClient.get<number>("https://localhost:7035/api/Khos/GetQuantityByProductAndSize/"+maSP+"/"+maSize);
    }
    getSoLuong(idUser: number, maSP: string, maSize: number): Observable<number> {
        return this.httpClient.get<number>(`https://localhost:7035/api/GioHangs/GetSoLuong?idUser=${idUser}&maSP=${maSP}&maSize=${maSize}`);
    }
    checkGioHang(idUser: number, maSP: string, maSize: number): Observable<boolean> {
        return this.httpClient.get<boolean>(`https://localhost:7035/api/GioHangs/CheckExists?idUser=${idUser}&maSP=${maSP}&maSize=${maSize}`);
    }
    updateQuantityGioHang(idUser: number, maSP: string, maSize: number, newQuantity: number): Observable<any> {
        const url = `https://localhost:7035/api/GioHangs/update-quantity?idUser=${idUser}&maSP=${maSP}&maSize=${maSize}&newQuantity=${newQuantity}`;
        return this.httpClient.put(url, {});
    }
    getGioHangByIdUser(userId: number): Observable<GioHang[]> {
        return this.httpClient.get<GioHang[]>(`https://localhost:7035/api/GioHangs/GetByPartialUserId?userId=${userId}`);
    }
    getGioHangWithProductInfo(userId: number): Observable<GioHangSanPham[]> {
        return this.httpClient.get<GioHangSanPham[]>(`https://localhost:7035/api/GioHangs/user/${userId}/giohang`);
    }
    getTotalQuantityByUserId(userId: number): Observable<number> {
        return this.httpClient.get<number>(`https://localhost:7035/api/GioHangs/total-quantity/${userId}`);
    }
    getSoLuongKhoByMaSP(maSP: string, maSize: number): Observable<number> {
        return this.httpClient.get<number>(`https://localhost:7035/api/Khos/GetSoLuongKhoByMaSP?maSP=${maSP}&maSize=${maSize}`);
    } 
    deleteGioHang(maGH: number):  Observable<GioHang> {
        return this.httpClient.delete<GioHang>("https://localhost:7035/api/GioHangs/Delete/" + maGH); 
    }
    addHoaDon(hoaDonRequest: HoaDon): Observable<HoaDon>{
        return this.httpClient.post<HoaDon>("https://localhost:7035/api/HoaDons/Insert", hoaDonRequest);
    }
    addCTHoaDon(ctHoaDonRequest: CTHoaDon): Observable<CTHoaDon>{
        return this.httpClient.post<CTHoaDon>("https://localhost:7035/api/CTHoaDons/Insert", ctHoaDonRequest);
    }
    updateKho(update: any):  Observable<any>{
        return this.httpClient.put<any>("https://localhost:7035/api/Khos/Update", update);
    }
    getNewMaHD(): Observable<ProductCodeResponse>{
        return this.httpClient.get<ProductCodeResponse>("https://localhost:7035/api/HoaDons/GenerateMaHDCode");
    }
    getTotalSoLuongByMaSPCTHD(maSP: string): Observable<number> {
        return this.httpClient.get<number>("https://localhost:7035/api/CTHoaDons/GetTotalSoLuongByMaSPCTHD/"+maSP);
    }
    getTotalSoLuongTonKhoByMaSP(maSP: string): Observable<number> {
        return this.httpClient.get<number>("https://localhost:7035/api/Khos/GetTotalQuantityByProduct/"+maSP);
    }
    checkEmail(email: string): Observable<boolean> {
        return this.httpClient.get<boolean>("https://localhost:7035/api/UserForms/CheckIfEmailExists/" + email);
    }
    checkEmailCode(email: any): Observable<boolean> {
        return this.httpClient.get<boolean>("https://localhost:7035/api/Codes/CheckIfCodeEmailExists/" + email);
    }
    updateCodeEmail(email: any): Observable<any> {
        return this.httpClient.put("https://localhost:7035/api/Codes/UpdateCodeAndSendEmail", null, {
          params: { email: email }
        });
    } 
    addCodeEmail(codeRequest: Code): Observable<Code>{
        return this.httpClient.post<Code>("https://localhost:7035/api/Codes/InsertAndSendEmail", codeRequest); 
    }
    verifyCode(email: any,code: any): Observable<boolean> {
        return this.httpClient.get<boolean>("https://localhost:7035/api/Codes/CheckIfEmailAndCodeExists/" + email + "/" + code);
    }
    getTopSellingProducts(): Observable<any[]> {
        return this.httpClient.get<any[]>(`https://localhost:7035/api/CTHoaDons/top-selling/5`);
    }
    getMonthlyRevenue(year: number): Observable<number[]> {
        return this.httpClient.get<number[]>(`https://localhost:7035/api/HoaDons/GetTongTienByYear/${year}`);
    }
    getHoaDon0(tinhTrang: number, page: number, pageSize: number): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/HoaDons/GetPagedByTinhTrang/"+tinhTrang+"/"+page+"/"+pageSize);
    }
    getHoaDon1(tinhTrang: number, idAdmin:number, page: number, pageSize: number): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/LSDuyets/GetPagedByTinhTrangAndAdmin/"+tinhTrang+"/"+idAdmin+"/"+page+"/"+pageSize);
    }
    getHoaDonId(id: number, page: number, pageSize: number): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/HoaDons/GetPagedById/"+id+"/"+page+"/"+pageSize);
    }
    getCTDHadmin(partialMaHD: string): Observable<any[]>{
        return this.httpClient.get<any[]>(`https://localhost:7035/api/CTHoaDons/GetByPartialTenSP/partial/${partialMaHD}`);
    }
    getHoaDon(maHD:string): Observable<HoaDon>{
        return this.httpClient.get<HoaDon>(`https://localhost:7035/api/HoaDons/Get/${maHD}`);
    }
    updateTinhTrangHD(maHD:string,tinhTrang:number):Observable<any>{
        const url = `https://localhost:7035/api/HoaDons/UpdateTinhTrang/${maHD}/${tinhTrang}`;
        return this.httpClient.put<any>(url, {});
    }
    checkTinhTrang0(maHD:string,tinhTrang:number): Observable<boolean> {
        return this.httpClient.get<boolean>("https://localhost:7035/api/HoaDons/CheckIfTinhTrang0/" + maHD + "/" + tinhTrang);
    }
    addLSDuyet1(lsRequest: LSDuyet): Observable<LSDuyet>{
        return this.httpClient.post<LSDuyet>("https://localhost:7035/api/LSDuyets/Insert", lsRequest);
    }
    getVouchersPage(page: number, pageSize: number): Observable<any> {
        return this.httpClient.get<any>("https://localhost:7035/api/Vouchers/GetAllVoucherPage/"+page+"/"+pageSize);
    }
    addVoucher(productRequest: Voucher): Observable<Voucher>{
        return this.httpClient.post<Voucher>("https://localhost:7035/api/Vouchers/Insert", productRequest);
    }
    getVoucher(code: string): Observable<Voucher>{
        return this.httpClient.get<Voucher>("https://localhost:7035/api/Vouchers/Get/" + code);
    }
    updateVoucher(updateProductRequest: Voucher):  Observable<Voucher>{
        return this.httpClient.put<Voucher>("https://localhost:7035/api/Vouchers/Update", updateProductRequest);
    }
    deleteVoucher(code: string):  Observable<Voucher> {
        return this.httpClient.delete<Voucher>("https://localhost:7035/api/Vouchers/Delete/" + code);
    }
    checkVoucher(code:string){
        return this.httpClient.post<any>("https://localhost:7035/api/Vouchers/CheckIfVoucherSL", code);
    }

} 